import React, { useEffect, useState } from 'react';
import { Button, Table, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error('Error fetching categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/categories/${id}`);
      message.success('Category deleted');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Error deleting category');
    }
  };

  const columns = [
    {
      title: '№',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div className="space-x-2">
          <Link to={`/categories/edit/${record._id}`}>
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
        <h2 className="text-xl font-bold">Categories</h2>
        <Link to="/categories/create">
          <Button type="primary">Create Category</Button>
        </Link>
      </div>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
}
