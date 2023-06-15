import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {QdrantVectorStore} from "../utils/qdrant";

import {PDFLoader} from 'langchain/document_loaders/fs/pdf';
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory';
import {
    JSONLoader,
    JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {CSVLoader} from "langchain/document_loaders/fs/csv";
import {EPubLoader} from "langchain/document_loaders/fs/epub";
import {DocxLoader} from "langchain/document_loaders/fs/docx";

import fs from "fs";
import * as path from 'path';



/* Name of directory to retrieve your files from
   Make sure to add your PDF files inside the 'docs' folder
*/
const filePath = 'docs';

async function add_doc(file: string, filePath: string) {
    let currentDir = path.dirname(__filename);
    let file_path  = path.resolve(currentDir, filePath);

    let data = JSON.stringify({
        docs_name: file,
        docs_path: file_path,
        total_page: 0,
        acitve: true
    });

     await fetch(`http://localhost:8081/add/doc`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

export const run = async () => {
    try {
        /*load raw docs from the all files in the directory */
        const directoryLoader = new DirectoryLoader(filePath, {
            '.pdf': (path) => new PDFLoader(path),
            ".json": (path) => new JSONLoader(path, "/texts"),
            ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
            ".txt": (path) => new TextLoader(path),
            ".csv": (path) => new CSVLoader(path, "text"),
            ".doc": (path) => new DocxLoader(path),
            ".docx": (path) => new DocxLoader(path),
            ".epub": (path) => new EPubLoader(path),
        });

        fs.readdir(filePath, async (err, files) => {
            if (err) {
                console.error(err);
                return;
            }
            files.forEach((file) => {
                console.log(file);
                // add_doc(file,filePath);
            });
        })

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
        let instance = await
            QdrantVectorStore.fromDocuments(
                docs,
                new OpenAIEmbeddings(),
                {
                    url: process.env.QDRANT_URL,
                    collectionName: "aaab_test_collection",
                }
            );
        console.log(instance)

    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};

(async () => {
    await run();
    console.log('ingestion complete');
})();
