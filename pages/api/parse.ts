import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {QdrantVectorStore} from "@/utils/qdrant";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";

export default async function handler(req: any, res: any) {
    const loader = new PDFLoader(req.body.path);
    const rawDocs = await loader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    await QdrantVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings(),
        {
            url: process.env.QDRANT_URL,
            collectionName: "aaab_test_collection",
        }
    );
    console.log('success');
}