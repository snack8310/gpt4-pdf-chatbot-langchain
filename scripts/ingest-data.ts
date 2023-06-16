import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {QdrantVectorStore} from "../utils/qdrant";

import {PDFLoader} from 'langchain/document_loaders/fs/pdf';
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory';

// import fs from "fs";
// import * as path from 'path';

/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/
const filePath = 'docs';

export const run_path = async (doc_path: string) => {
    const loader = new PDFLoader(doc_path);
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
}

export const run = async () => {
    try {
        /*load raw docs from the all files in the directory */
        const directoryLoader = new DirectoryLoader(filePath, {
            '.pdf': (path) => new PDFLoader(path),
        });

        // const loader = new PDFLoader(filePath);
        const rawDocs = await directoryLoader.load();

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

    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};

(async () => {
    await run();
    console.log('ingestion complete');
})();
