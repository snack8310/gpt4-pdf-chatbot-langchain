import {Button, Table} from "antd";
import React from "react";
import PropTypes from "prop-types";


const renderEmpty = (text: any) => {
  return text || '-'
}

const ChunkTable = ({ pagination, tableData}) => {

  console.log("tableData", tableData)
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
        const reportId = record.reportId
        const no = record.recordMonth
        const time = record.recordDate
        const title = record.title
        // 状态为生成中、失败时，查看按钮置灰
        const canView = record.canView || false

        return (
          <div className="view-download-container">
            <Button>删除</Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="data-container">
      <Table
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