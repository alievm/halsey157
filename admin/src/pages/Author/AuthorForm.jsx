import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function AuthorForm() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      axios.get(`/authors/${id}`)
        .then((res) => {
          form.setFieldsValue({
            name: res.data.name,
            bio: res.data.bio,
          });
        })
        .catch((err) => {
          console.error(err);
          message.error('Error loading author');
        });
    }
  }, [id]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (isEdit) {
        await axios.put(`/authors/${id}`, values);
        message.success('Author updated');
      } else {
        await axios.post('/authors', values);
        message.success('Author created');
      }
      navigate('/authors');
    } catch (error) {
      console.error(error);
      message.error('Error saving author');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Edit Author' : 'Create Author'}
      </h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Author Name"
          name="name"
          rules={[{ required: true, message: 'Please enter author name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Bio"
          name="bio"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Form>
    </div>
  );
}
