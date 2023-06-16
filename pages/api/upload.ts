import {NextApiRequest, NextApiResponse} from "next";
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = path.join(process.cwd(), 'docs');
        fs.mkdirSync(folder, {recursive: true});
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const fileName = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
        );
        console.log(fileName)
        cb(null, fileName);
    },
});

export const config = {
    api: {bodyParser: false}
}

export default async function handler(req: any, res: any) {
    await new Promise(resolve => {
        // you may use any other multer function
        const mw = multer({storage}).any()

        //use resolve() instead of next()
        mw(req, res, resolve)
    })

    // example response
    res.status(200).json({
        body: req.body,
        files: req.files,
    })
}
