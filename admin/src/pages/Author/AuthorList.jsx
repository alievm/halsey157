import React, { useEffect, useState } from 'react';
import { Button, Table, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/authors');
      setAuthors(res.data);
    } catch (error) {
      console.error(error);
      message.error('Error fetching authors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/authors/${id}`);
      message.success('Author deleted');
      fetchAuthors();
    } catch (error) {
      console.error(error);
      message.error('Error deleting author');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Link to={`/authors/edit/${record._id}`}>
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
        <h2 className="text-xl font-bold">Authors</h2>
        <Link to="/authors/create">
          <Button type="primary">Create Author</Button>
        </Link>
      </div>
      <Table
        dataSource={authors}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
}
