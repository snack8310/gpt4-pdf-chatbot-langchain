import React, {useState} from 'react';
import {Upload, Button, message,} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {RcFile, UploadFile} from 'antd/lib/upload/interface';
import {run_path} from 'scripts/ingest-data'
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

interface UploadFileComponentProps {
    uploadUrl: string;
}

function formatDate(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}


async function add_doc(file_name: string, file_path: string) {

    let data = JSON.stringify({
        docs_name: file_name,
        docs_path: file_path,
        total_page: 0,
        acitve: true,
        created_time: formatDate(new Date()),
        updated_time: formatDate(new Date())
    });

    let doc_id = 0;
    fetch(`http://127.0.0.1:5001/add/doc`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://127.0.0.1:5001'
        },
        body: data
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            doc_id = data;
        })
        .catch(error => console.error(error));
    return doc_id;
}

const UploadFileComponent: React.FC<UploadFileComponentProps> = ({uploadUrl}) => {
    const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);

    const handleUpload = async () => {
        const formData = new FormData();
        console.log("file", fileList);

        formData.append('file', fileList[0].originFileObj as File);

        let doc_path = "";

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    message.success("上传成功!")
                    doc_path = data.files[0].path;
                    add_doc(data.files[0].filename, data.files[0].path);
                })
                .catch(error => console.error(error));


        } catch (error) {
            console.error(error);
            message.error('上传失败！');
        }
        console.log(doc_path);

        await fetch('/api/parse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: doc_path
            }),
        }).then(response => response.json())
            .then(data => {
                message.success("训练成功!")
            })
            .catch(error => console.log(error))

    };

    const handleFileChange = ({fileList}: { fileList: UploadFile<RcFile>[] }) => {
        setFileList(fileList.filter((file) => file.type === 'application/pdf'));
    };

    const props = {
        onChange: handleFileChange,
        fileList,
        accept: '.pdf',
        beforeUpload: () => false
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh'}}>
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>上传</Button>
                </Upload>
                <Button onClick={handleUpload}>提交</Button>
            </div>
        </>
    );
};

export default UploadFileComponent;
