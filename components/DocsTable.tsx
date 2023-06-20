import {Button, notification, Space, Table} from "antd";
import React from "react";
import {useRouter} from "next/router";


const renderEmpty = (text: any) => {
  return text || '-'
}

const DocsTable = ({ refresh, pagination, tableData}) => {

  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  function handleDelete(record: any) {
    console.log("delete record", record)
    try {
      const response = fetch(`http://127.0.0.1:5000/delete/doc/${record.id}`, {
        method: 'POST',

      })
        .then(res =>{
          console.log("delete res", res)

          api.info({
            message: res.status === 200 ? '删除成功' : '删除失败',
            placement: 'top',
          })
        })
        .catch(error => {
          api.info({
            message: `删除失败`,
            placement: 'top',
          })
          console.error('请求出错:', error)
        })
      }
     catch (e) {
      alert("删除失败")
      console.log(e)
     }

    refresh && refresh()
  }

  async function handleView(record: any) {
    console.log("id", record.id)

    await router.push(`/chunk?id=${record.id}`); // 替换为实际的新页面路径
  }

  const columns = [
    {
      title: '文档编号',
      dataIndex: 'id',
      render: renderEmpty,
    },
    {
      title: '文档名称',
      dataIndex: 'docs_name',
      render: renderEmpty,
    },
    {
      title: '总页数',
      dataIndex: 'total_page',
      render: renderEmpty,
    },
    {
      title: '操作',
      width: 100,
      dataIndex: 'action',
      render: (_: any, record: any) => {
        return (
          <div className="view-download-container">
            <Space direction="horizontal">
              <Space wrap>
                <Button onClick={() => handleView(record)}>查看</Button>
                <Button danger type="text" onClick={() => handleDelete(record)}>删除</Button>
              </Space>
            </Space>
          </div>
        )
      },
    },
  ]

  return (
    <div className="data-container">
      {contextHolder}
      <Space style={{marginLeft:30, marginBottom:10}}>
        <Button onClick={refresh}>
          刷新
        </Button>
      </Space>
      <Table
        style={{marginLeft:30, marginRight:30}}
        rowKey={(_) => _.id}
        pagination={pagination}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  )
}

export default DocsTable