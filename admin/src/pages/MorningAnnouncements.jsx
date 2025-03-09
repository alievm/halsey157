// src/pages/AdminMorningAnnouncements.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, message, Modal } from 'antd';
import ReactQuill from 'react-quill-new';
import axios from '../api/axios';

const AdminMorningAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Получаем список объявлений
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/morning-announcements');
      setAnnouncements(res.data);
    } catch (error) {
      message.error('Error fetching announcements.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Обработка создания/обновления объявления
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await axios.put(`/morning-announcements/${editingId}`, values);
        message.success('Announcement updated successfully.');
      } else {
        await axios.post('/morning-announcements', values);
        message.success('Announcement created successfully.');
      }
      form.resetFields();
      setEditingId(null);
      setModalVisible(false);
      fetchAnnouncements();
    } catch (error) {
      message.error('Error saving announcement.');
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/morning-announcements/${id}`);
      message.success('Announcement deleted successfully.');
      fetchAnnouncements();
    } catch (error) {
      message.error('Error deleting announcement.');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (html) => <div dangerouslySetInnerHTML={{ __html: html }} />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold mb-4">Morning Announcements Admin</h1>
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
          setEditingId(null);
          form.resetFields();
        }}
        style={{ marginBottom: 16 }}
      >
        Create Announcement
      </Button>
      <Table
        dataSource={announcements}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingId ? 'Edit Announcement' : 'Create Announcement'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
            getValueFromEvent={(value, delta, source, editor) => editor.getHTML()} // Сохраняем HTML-формат
            >
              <ReactQuill theme="snow" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMorningAnnouncements;
