// src/pages/ClassPage.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message } from 'antd';
import axios from '../api/axios';

const ClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  
  const [form] = Form.useForm();
  
  useEffect(() => {
    fetchClasses();
  }, []);
  
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/classes');
      setClasses(res.data);
    } catch (error) {
      message.error('Ошибка загрузки классов');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = () => {
    setEditingClass(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  
  const handleEdit = (record) => {
    setEditingClass(record);
    form.setFieldsValue({ title: record.title });
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/classes/${id}`);
      message.success('Класс удален');
      fetchClasses();
    } catch (error) {
      message.error('Ошибка удаления класса');
    }
  };
  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingClass) {
        await axios.put(`/classes/${editingClass._id}`, values);
        message.success('Класс обновлен');
      } else {
        await axios.post('/classes', values);
        message.success('Класс создан');
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (error) {
      message.error('Ошибка при сохранении класса');
    }
  };
  
  const columns = [
    {
      title: '№',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Удалить</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Классы</h1>
        <Button type="primary" onClick={handleCreate}>
          Добавить класс
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={classes}
        rowKey={(record) => record._id}
        loading={loading}
      />
      
      <Modal
        title={editingClass ? 'Редактировать класс' : 'Создать класс'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Введите название класса' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassPage;
