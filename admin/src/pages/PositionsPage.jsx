// src/pages/PositionsPage.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Slider, message, Popconfirm } from 'antd';
import axios from '../api/axios';

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Состояние для модального окна (создание/редактирование)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);

  // Антд-шная форма
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/positions');
      // Сортировка на клиенте по приоритету (если сервер не сортирует)
      const sortedPositions = res.data.sort((a, b) => a.priority - b.priority);
      setPositions(sortedPositions);
    } catch (error) {
      message.error('Error fetching positions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPosition(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingPosition(record);
    form.setFieldsValue({ name: record.name, priority: record.priority });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/positions/${id}`);
      message.success('Position deleted');
      fetchPositions();
    } catch (error) {
      message.error('Error deleting position');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingPosition) {
        // Редактирование
        await axios.put(`/positions/${editingPosition._id}`, values);
        message.success('Position updated');
      } else {
        // Создание
        await axios.post('/positions', values);
        message.success('Position created');
      }
      fetchPositions();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Error saving position');
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
      title: 'Priority',
      dataIndex: 'priority',
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Positions</h1>
        <Button type="primary" onClick={handleCreate}>
          Add Position
        </Button>
      </div>
      <Table columns={columns} dataSource={positions} rowKey={(record) => record._id} loading={loading} />

      <Modal
        title={editingPosition ? 'Edit Position' : 'Create Position'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Position Name"
            name="name"
            rules={[{ required: true, message: 'Please enter position name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please set position priority' }]}
            initialValue={0}
          >
            <Slider min={0} max={20} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PositionsPage;
