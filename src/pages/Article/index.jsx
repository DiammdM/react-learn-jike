import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Popconfirm,
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import useGetChannels from '@/hooks/userChannel';

// 导入资源
import { Table, Tag, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import img404 from '@/assets/error.png';
import { useEffect, useState } from 'react';
import { delArticleAPI, getArticleListAPI } from '@/apis/article';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  // 准备列数据
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (data) => {
        return data === 1 ? (
          <Tag color="warning">审核中</Tag>
        ) : (
          <Tag color="green">审核通过</Tag>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/publish?id=${data.id}`);
              }}
            />
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(data.id)}
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { channels } = useGetChannels();
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [params, setParams] = useState({
    status: '',
    channel_id: '',
    begin_pubdate: '',
    end_pubdate: '',
    page: pagination.current,
    per_page: pagination.pageSize,
  });

  // Search Btn Click Event
  const onFinish = (values) => {
    console.log(params);
    const { status, channel_id, date } = values;
    setPagination({
      ...pagination,
      current: 1,
    });

    setParams({
      ...params,
      page: 1,
      status,
      channel_id,
      begin_pubdate: date[0].format('YYYY-MM-DD'),
      end_pubdate: date[1].format('YYYY-MM-DD'),
    });
  };

  const refreshTable = async (args) => {
    setLoading(true);
    const res = await getArticleListAPI(args);
    setList(res.data.results);
    setLoading(false);
    return res;
  };

  useEffect(() => {
    (async () => {
      const res = await refreshTable(params);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total_count,
      }));
    })();
  }, [params]);

  const handleTableChange = (args) => {
    setPagination(args);
    setParams({
      ...params,
      page: args.current,
    });
  };

  const handleDelete = async (id) => {
    console.log('id:' + id);
    await delArticleAPI(id);
    setParams((prev) => ({
      ...prev,
    }));
  };

  return (
    <div>
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={'/'}>首页</Link> },
              { title: '文章列表' },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              defaultValue="lucy"
              style={{ width: 120 }}
            >
              {channels.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${pagination.total} 条结果：`}>
        <Table
          rowKey="id"
          loading={{ spinning: loading, tip: 'Loading' }}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Article;
