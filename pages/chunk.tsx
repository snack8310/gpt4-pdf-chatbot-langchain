import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import Layout from "@/components/layout";
import {Docs} from "@/types/docs";
import ChunkTable from "@/components/ChunkTable";

const Chunk = () => {
  // const [data, setData] = React.useState<Docs[]>([])
  const [page, setPage] = useState({ pageSize: 5, current: 1, total: 0 })
  const [tableData, setTableData] = useState([])

  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    // 在页面加载时打印接收到的 id 参数
    console.log(id);
    fetchData({ id })
    .then(res => {
      console.log("res", res)
      return res.json()
    })
    .then(json => {
      console.log("json", json)
      console.log("json.results", json.results)
      // setData(json["data"])
      setTableData(json["data"])
    })

    // .catch(error => console.error('请求出错:', error));

    // console.log(data)
  }, [])

  const fetchData = (params: any) => {
    return fetch(`http://127.0.0.1:5000//getAll/chunk/${id}?current=${params.current}&pageSize=${params.pageSize}`)
      // .then(res => {
      //   console.log("res", res)
      //   return res.json()
      // })
      // .then(json => {
      //   console.log("json", json)
      //   console.log("json.results", json.results)
      //   setData(json["data"])
      // })
  }


  console.log(id)

  const onPageChange = (pageIndex: any,pageSize: any) => {
    console.log("pageIndex", pageIndex)
    setPage({ ...page, current: pageIndex })
    queryTableData({ id, current: pageIndex, pageSize })
  }

  const queryTableData = (params={}) => {
    // const { current, pageSize } = page
    const { current,id, pageSize } = params
    console.log("current, pageSize", current)
    fetchData({ current, id, pageSize })
      .then((res) => {
        console.log("res", res)
        return res.json()
      })
      .then((res) => {
        if (!res) {
          setPage({ pageSize: 5, current: 1, total: 0 })
          setTableData([])
        }
        if (res['pageInfo']) {
          setPage(res['pageInfo'])
        }
        setTableData(res['data'] || [])
      })
      .catch((err) => {
        setTableData([])
        setPage({ pageSize: 5, current: 1, total: 0 })
      })
  }



  return (
    <>
      <Layout>
        <div className="chunk">
          <ChunkTable
            tableData={tableData}
            pagination={{
              ...page,
              showTotal: (total) => `共${total}条`,
              showSizeChanger: false,
              onChange: onPageChange,
            }}
          />
        </div>
      </Layout>
    </>
  )

}


export default Chunk;