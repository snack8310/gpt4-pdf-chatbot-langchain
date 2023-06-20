import {Button, notification, Space, Table} from "antd";
import React from "react";
import PropTypes from "prop-types";


const renderEmpty = (text: any) => {
  return text || '-'
}

const ChunkTable = ({ refresh, pagination, tableData}) => {

  const [api, contextHolder] = notification.useNotification();

  console.log("tableData", tableData)
  function handleDelete(record: any) {
    console.log("delete record", record)
    try {
      fetch(`http://127.0.0.1:5000/delete/chunk/${record.id}`, {
        method: 'POST'
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

    } catch (e) {
      alert("删除失败")
      console.log(e)
    }
    refresh && refresh()
  }

  const columns = [
    {
      title: '向量编号',
      dataIndex: 'vector_id',
      render: renderEmpty,
    },
    {
      title: '文章内容',
      dataIndex: 'page_content',
      render: renderEmpty,
    },
    {
      title: '页号',
      dataIndex: 'page_number',
      render: renderEmpty,
    },
    {
      title: '起始行数',
      dataIndex: 'lines_from',
      render: renderEmpty,
    },
    {
      title: '结束行数',
      dataIndex: 'lines_to',
      render: renderEmpty,
    },
    {
      title: '操作',
      width: 100,
      dataIndex: 'action',
      render: (_: any, record: any) => {
        return (
          <div className="view-download-container">
            <Button danger type="text" onClick={() => handleDelete(record)}>删除</Button>
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

ChunkTable.propTypes = {
  pagination: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
}

export default ChunkTable;