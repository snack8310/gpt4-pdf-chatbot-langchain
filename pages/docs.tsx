import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {Avatar, Button, List, Space} from 'antd';
import Layout from '@/components/layout';
import React, {useEffect} from 'react';

import {Docs} from "@/types/docs";
import { useRouter } from 'next/router';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const DocsComponent: React.FC = () => {

  const [data, setData] = React.useState<Docs[]>([])
  const router = useRouter();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/getAll')
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


  async function handleLink(id: any) {
    console.log("id", id)

    await router.push(`/chunk?id=${id}`); // 替换为实际的新页面路径
    // const url = '/getAll/chunk/' + id + "?" + "current=1&pageSize=10"
    // const response = await fetch(url, {
    //   method: 'GET',
    //   // headers: {
    //   //   'Content-Type': 'application/json',
    //   // },
    // });
    // const data = await response.json();
    // console.log('data', data);
  }

  return (
    <>
      <Layout>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
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
              // actions={[
              //   <IconText icon={StarOutlined} text="156" key="list-vertical-star-o"/>,
              //   <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o"/>,
              //   <IconText icon={MessageOutlined} text="2" key="list-vertical-message"/>,
              // ]}
              extra={
                // <img
                //   width={272}
                //   alt="logo"
                //   src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                // />
                <Button type="link" onClick={() => handleLink(item.id)}>查看</Button>
              }
            >
              {item.docs_name}
            </List.Item>
          )}
        />
      </Layout>

    </>
  )
};

export default DocsComponent;