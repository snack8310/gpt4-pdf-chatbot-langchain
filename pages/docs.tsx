import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import Layout from '@/components/layout';
import React, {useEffect} from 'react';

import {Docs} from "@/types/docs";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const DocsComponent: React.FC = () => {

  const [data, setData] = React.useState<Docs[]>([])

  useEffect(() => {
    fetch('http://127.0.0.1:5001/getAll')
      .then(res => {
        console.log("res", res)
        return res.json()
      })
      .then(json => {
        console.log("json", json)
        console.log("json.results", json.results)
        setData(json["data"])
      })
      // .catch(error => console.error('请求出错:', error));

    console.log(data)
  }, [])

  return (
    <>
      <Layout>
      </Layout>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={data}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o"/>,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o"/>,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message"/>,
            ]}
            extra={
              <img
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
          >
            {item.docs_name}
          </List.Item>
        )}
      />
    </>
  )
};

export default DocsComponent;