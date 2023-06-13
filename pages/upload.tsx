import React, { useState } from 'react';
import { Upload, Button, message, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import  {run} from 'scripts/ingest-data'

interface UploadFileComponentProps {
  uploadUrl: string;
}

const UploadFileComponent: React.FC<UploadFileComponentProps> = ({ uploadUrl }) => {
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);

  const handleUpload = async () => {
    const formData = new FormData();
    console.log("file", fileList);

    formData.append('file', fileList[0].originFileObj as File);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log(response);
        message.success('上传成功！');
      } else {
        throw new Error('上传失败！');
      }
    } catch (error) {
      console.error(error);
      message.error('上传失败！');
    }

    // await run()
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile<RcFile>[] }) => {
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
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />} >上传</Button>
        </Upload>
        <Button  onClick={handleUpload}>提交</Button>
      </div>
    </>
  );
};

export default UploadFileComponent;
