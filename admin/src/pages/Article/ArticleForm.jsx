import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;

export default function ArticleForm() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const isEdit = !!id;

  // Загрузка списков категорий и сотрудников
  const fetchData = async () => {
    try {
      const [catRes, authRes] = await Promise.all([
        axios.get('/categories'),
        axios.get('/staff')
      ]);
      setCategories(catRes.data);
      setAuthors(authRes.data);
    } catch (error) {
      console.error(error);
      message.error('Error loading categories or staff');
    }
  };

  // Загрузка статьи при редактировании
  const fetchArticle = async () => {
    if (isEdit) {
      try {
        const res = await axios.get(`/articles/${id}`);
        const article = res.data;
        // Устанавливаем поля формы:
        form.setFieldsValue({
          title: article.title,
          description: article.description,
          category: article.category?._id,
          // Преобразуем массив объектов staff в массив их _id
          staff: article.staff ? article.staff.map(member => member._id) : [],
          photo: article.photo
            ? [{ uid: '-1', name: 'Image', status: 'done', url: `${BASE_URL}${article.photo}` }]
            : []
        });
      } catch (error) {
        console.error(error);
        message.error('Error loading article');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      
      // Для отправки нескольких значений для поля staff добавляем их по отдельности
      values.staff.forEach(staffId => {
        formData.append('staff', staffId);
      });

      if (values.photo && values.photo[0]?.originFileObj) {
        formData.append('photo', values.photo[0].originFileObj);
      }

      if (isEdit) {
        await axios.put(`/articles/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Article updated');
      } else {
        await axios.post('/articles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Article created');
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      message.error('Error saving article');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    // e = { fileList: [...] }
    return e && e.fileList;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? 'Edit Article' : 'Create Article'}
      </h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
          getValueFromEvent={(value, delta, source, editor) => editor.getHTML()} // Сохраняем HTML-формат
        >
          <ReactQuill theme="snow" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            {categories.map(cat => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Staff"
          name="staff"
          rules={[{ required: true, message: 'Please select at least one staff member' }]}
        >
          <Select placeholder="Select staff" mode="multiple">
            {authors.map(author => (
              <Select.Option key={author._id} value={author._id}>
                {author.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Photo"
          name="photo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}  // отключаем авто-загрузку, чтобы вручную отправить
          >
            <Button>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Form>
    </div>
  );
}
