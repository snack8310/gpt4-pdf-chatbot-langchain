import {QdrantClient} from "@qdrant/js-client-rest";
import {v4 as uuid} from "uuid";
import {VectorStore} from "langchain/vectorstores/base";
import {Document} from "langchain/document";


function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

async function add_doc_chunk(x) {
    let data = JSON.stringify({
        docs_id: 1,
        vector_id: x.id,
        page_content: x.payload.content,
        source: x.payload.metadata.source,
        page_number: x.payload.metadata.loc.pageNumber,
        lines_from: x.payload.metadata.loc.lines.from,
        lines_to: x.payload.metadata.loc.lines.to,
        acitve: true,
        total_page: x.payload.metadata.totalPage,
        created_time: formatDate(new Date()),
        updated_time: formatDate(new Date())
    });
    console.log(data);
    fetch(`http://127.0.0.1:5001/add/chunk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://127.0.0.1:5001'
        },
        body: data
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

export class QdrantVectorStore extends VectorStore {
    constructor(embeddings, args) {
        super(embeddings, args);
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collectionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collectionConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const url = args.url ??
            // eslint-disable-next-line no-process-env
            (typeof process !== "undefined" ? process.env?.QDRANT_URL : undefined);
        if (!args.client && !url) {
            throw new Error("Qdrant client or url address must be set.");
        }
        this.client =
            args.client ||
            new QdrantClient({
                url,
            });
        this.collectionName = args.collectionName ?? "documents";
        this.collectionConfig = args.collectionConfig ?? {
            vectors: {
                size: 1536,
                distance: "Cosine",
            },
        };
    }

    async addDocuments(documents) {
        const texts = documents.map(({pageContent}) => pageContent);
        await this.addVectors(await this.embeddings.embedDocuments(texts), documents);
    }

    async addVectors(vectors, documents) {
        if (vectors.length === 0) {
            return;
        }
        await this.ensureCollection();
        const points = vectors.map((embedding, idx) => ({
            id: uuid(),
            vector: embedding,
            payload: {
                content: documents[idx].pageContent,
                metadata: documents[idx].metadata,
            },
        }));
        points.map(x => {
            setTimeout(() => {
                add_doc_chunk(x);
            }, 100)

        });
        await this.client.upsert(this.collectionName, {
            wait: true,
            points,
        });
    }

    async similaritySearchVectorWithScore(query, k, filter) {
        if (!query) {
            return [];
        }
        await this.ensureCollection();
        const results = await this.client.search(this.collectionName, {
            vector: query,
            limit: k,
            filter,
        });
        const result = results.map((res) => [
            new Document({
                metadata: res.payload.metadata,
                pageContent: res.payload.content,
            }),
            res.score,
        ]);
        return result;
    }

    async ensureCollection() {
        const response = await this.client.getCollections();
        const collectionNames = response.collections.map((collection) => collection.name);
        if (!collectionNames.includes(this.collectionName)) {
            await this.client.createCollection(this.collectionName, this.collectionConfig);
        }
    }

    static async fromTexts(texts, metadatas, embeddings, dbConfig) {
        const docs = [];
        for (let i = 0; i < texts.length; i += 1) {
            const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
            const newDoc = new Document({
                pageContent: texts[i],
                metadata,
            });
            docs.push(newDoc);
        }
        return QdrantVectorStore.fromDocuments(docs, embeddings, dbConfig);
    }

    static async fromDocuments(docs, embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        await instance.addDocuments(docs);
        return instance;
    }

    static async fromExistingCollection(embeddings, dbConfig) {
        const instance = new this(embeddings, dbConfig);
        await instance.ensureCollection();
        return instance;
    }
}
