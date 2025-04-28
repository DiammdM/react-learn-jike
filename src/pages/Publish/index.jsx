import { PlusOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Upload,
} from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import './index.scss';

import { createArticleAPI, getArticleById } from '@/apis/article';
import useGetChannels from '@/hooks/userChannel';
import { isEmpty } from 'lodash-es';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const Publish = () => {
  const { channels } = useGetChannels();
  const [searchParams] = useSearchParams();
  const [uploadImgInfo, setUploadImgInfo] = useState();

  const id = searchParams.get('id');

  const onUploadChange = (e) => {
    console.log(e);
    const { fileList } = e;
    setUploadImgInfo(fileList);
  };

  const onFinish = (formValue) => {
    const { title, content, channel_id } = formValue;
    const data = {
      title,
      content,
      cover: {
        type: imageType,
        images: uploadImgInfo.map((item) => {
          if (item.response) {
            return item.response.data.url;
          } else {
            return item.url;
          }
        }),
      },
      channel_id,
    };
    if (id) {
      createArticleAPI({ ...data, id });
    } else {
      createArticleAPI(data);
    }
  };

  const [imageType, setImageType] = useState(0);
  const onChangeImgType = (e) => {
    console.log(e.target.value);
    setImageType(e.target.value);
  };

  const [form] = Form.useForm();
  useEffect(() => {
    if (isEmpty(id)) {
      return;
    }
    (async () => {
      const res = await getArticleById(id);
      console.log('res:', res);
      const { channel_id, content, cover, title } = res.data;
      form.setFieldsValue({
        title,
        channel_id,
        content,
        type: cover.type,
      });

      setImageType(cover.type);
      setUploadImgInfo(
        cover.images.map((url) => {
          return { url };
        })
      );
    })();
  }, [id, form]);

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={'/'}>首页</Link> },
              { title: '发布文章' },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channels.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group>
                <Radio value={1} onChange={onChangeImgType}>
                  单图
                </Radio>
                <Radio value={3} onChange={onChangeImgType}>
                  三图
                </Radio>
                <Radio value={0} onChange={onChangeImgType}>
                  无图
                </Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload
                listType="picture-card"
                showUploadList
                name="image"
                action="http://geek.itheima.net/v1_0/upload"
                onChange={onUploadChange}
                maxCount={imageType}
                fileList={uploadImgInfo}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            ></ReactQuill>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
