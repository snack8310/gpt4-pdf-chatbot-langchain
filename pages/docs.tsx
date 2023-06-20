import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {Avatar, Button, List, Space} from 'antd';
import Layout from '@/components/layout';
import DocsTable from "@/components/DocsTable";
import React, {useEffect, useState} from 'react';

import {Docs} from "@/types/docs";
import { useRouter } from 'next/router';


const DocsComponent: React.FC = () => {
  const PAGE_SIZE = 5

  const [page, setPage] = useState({ pageSize: PAGE_SIZE, current: 1, total: 0 })
  const [tableData, setTableData] = useState([])

  const [data, setData] = React.useState<Docs[]>([])
  const router = useRouter();

  const fetchData = (params: any) => {
    return fetch(`http://127.0.0.1:5000/getAll?current=${params.current}&pageSize=${params.pageSize}`)
  }

  useEffect(() => {
    // const {current, pageSize} = page
    fetchData({ current: 1, pageSize: PAGE_SIZE  })
      .then(res => {
        console.log("res", res)
        return res.json()
      })
      .then(json => {
        console.log("json", json)
        console.log("json.results", json.results)
        setData(json["data"])
        setPage(json["pageInfo"])
      })
      // .catch(error => console.error('请求出错:', error));

    console.log(data)
  }, [])


  const refresh = () => {
    const { current, pageSize } = page
    queryTableData({ current, pageSize })
  }

  const onPageChange = (pageIndex: any,pageSize: any) => {
    console.log("pageIndex", pageIndex)
    setPage({ ...page, current: pageIndex })
    queryTableData({ current: pageIndex, pageSize })
  }

  const queryTableData = (params={}) => {
    // const { current, pageSize } = page
    const { current, pageSize } = params
    console.log("current, pageSize", current, pageSize)
    fetchData({ current, pageSize })
      .then((res) => {
        console.log("res", res)
        return res.json()
      })
      .then((res) => {
        if (!res) {
          setPage({ pageSize: PAGE_SIZE, current: 1, total: 0 })
          setData([])
        }
        if (res['pageInfo']) {
          setPage(res['pageInfo'])
        }
        setData(res['data'] || [])
      })
      .catch((err) => {
        setData([])
        setPage({ pageSize: PAGE_SIZE, current: 1, total: 0 })
      })
  }

  async function handleLink(id: any) {
    console.log("id", id)

    await router.push(`/chunk?id=${id}`); // 替换为实际的新页面路径
  }

  return (
    <>
      <Layout>
        {/*<List*/}
        {/*  itemLayout="vertical"*/}
        {/*  size="large"*/}
        {/*  pagination={{*/}
        {/*    onChange: (page) => {*/}
        {/*      console.log(page);*/}
        {/*    },*/}
        {/*    pageSize: 5,*/}
        {/*  }}*/}
        {/*  dataSource={data}*/}
        {/*  renderItem={(item) => (*/}
        {/*    <List.Item*/}
        {/*      key={item.id}*/}
        {/*      extra={*/}
        {/*        <Button type="link" onClick={() => handleLink(item.id)}>查看</Button>*/}
        {/*      }*/}
        {/*    >*/}
        {/*      {item.docs_name}*/}
        {/*    </List.Item>*/}
        {/*  )}*/}
        {/*/>*/}

        <DocsTable
          refresh={refresh}
          tableData={data}
          pagination={{
            ...page,
            showTotal: (total) => `共${total}条`,
            showSizeChanger: false,
            onChange: onPageChange,
          }}
        />
      </Layout>

    </>
  )
};

export default DocsComponent;