import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function CategoryForm() {
  const [form] = Form.useForm();
  const { id } = useParams();   // :id из URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isEdit = !!id; // true если редактируем

  useEffect(() => {
    if (isEdit) {
      // Загрузить данные категории
      axios.get(`/categories/${id}`)
        .then((res) => {
          form.setFieldsValue({
            name: res.data.name,
          });
        })
        .catch((err) => {
          console.error(err);
          message.error('Error loading category');
        });
    }
  }, [id]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (isEdit) {
        await axios.put(`/categories/${id}`, values);
        message.success('Category updated');
      } else {
        await axios.post('/categories', values);
        message.success('Category created');
      }
      navigate('/categories');
    } catch (error) {
      console.error(error);
      message.error('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Edit Category' : 'Create Category'}
      </h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Form>
    </div>
  );
}
