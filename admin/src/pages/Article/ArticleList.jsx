import React, { useEffect, useState } from 'react';
import { Button, Table, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/articles'); 
      // предполагается, что бэкенд делает populate() для author и category
      setArticles(res.data);
    } catch (error) {
      console.error(error);
      message.error('Error fetching articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/articles/${id}`);
      message.success('Article deleted');
      fetchArticles();
    } catch (error) {
      console.error(error);
      message.error('Error deleting article');
    }
  };

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      render: (photo) => (
        photo
          ? <img src={`${BASE_URL}${photo}`} alt="Article" style={{ width: 80, height: 50, objectFit: 'cover' }} />
          : 'No image'
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Category',
      render: (_, record) => record.category ? record.category.name : '—',
    },
    {
      title: 'Author',
      render: (_, record) => record.author ? record.author.name : '—',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Link to={`/articles/edit/${record._id}`}>
            <Button type="primary" size="small">Edit</Button>
          </Link>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="danger" size="small">Delete</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Articles</h2>
        <Link to="/articles/create">
          <Button type="primary">Create Article</Button>
        </Link>
      </div>
      <Table
        dataSource={articles}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
}
