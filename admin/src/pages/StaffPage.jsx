import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Popconfirm,
} from 'antd';
import axios from '../api/axios';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;

// Функция подсветки искомого текста
function highlightText(text = '', highlight = '') {
  if (!highlight) return text;

  const lowerText = text.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();
  const startIndex = lowerText.indexOf(lowerHighlight);

  if (startIndex === -1) {
    // Совпадений нет
    return text;
  }

  const endIndex = startIndex + highlight.length;
  return (
    <>
      {text.substring(0, startIndex)}
      <span style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
        {text.substring(startIndex, endIndex)}
      </span>
      {text.substring(endIndex)}
    </>
  );
}

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [positions, setPositions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState(''); // <-- Состояние для поиска

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaff();
    fetchPositions();
    fetchClasses();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/staff');
      setStaff(res.data);
    } catch (error) {
      message.error('Error fetching staff');
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await axios.get('/positions');
      setPositions(res.data);
    } catch (error) {
      message.error('Error fetching positions');
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/classes');
      setClasses(res.data);
    } catch (error) {
      message.error('Error fetching classes');
    }
  };

  const handleCreate = () => {
    setEditingStaff(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      position: record.position?._id,
      class: record.class?._id,
      // Если есть year, тоже заполняйте
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/staff/${id}`);
      message.success('Staff deleted');
      fetchStaff();
    } catch (error) {
      message.error('Error deleting staff');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('position', values.position);
      formData.append('class', values.class);

      if (values.photos && values.photos.fileList) {
        values.photos.fileList.forEach((file) => {
          formData.append('photos', file.originFileObj);
        });
      }

      if (editingStaff) {
        await axios.put(`/staff/${editingStaff._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Staff updated');
      } else {
        await axios.post('/staff', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Staff created');
      }

      fetchStaff();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Error saving staff');
    }
  };

  // Определяем колонки
  const columns = [
    {
      title: '№',
      render: (_, __, index) => index + 1,
      key: 'index',
    },
    {
      title: 'Photos',
      dataIndex: 'photos',
      key: 'photos',
      render: (photos) => {
        if (!photos || photos.length === 0) return 'No photos';
        return (
          <div className="flex gap-2">
            {photos.map((photo, index) => {
              const fullUrl = `${BASE_URL}${photo}`;
              return (
                <img
                  key={index}
                  src={fullUrl}
                  alt="Staff"
                  className="w-12 h-12 object-cover rounded"
                />
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      // Подсвечиваем найденный текст
      render: (text) => highlightText(text, searchText),
    },
    {
      title: 'Position',
      dataIndex: ['position', 'name'],
      key: 'position',
      // Пример сортировки/фильтров, если нужно
      sorter: (a, b) => {
        const posA = a.position?.name || '';
        const posB = b.position?.name || '';
        return posA.localeCompare(posB);
      },
      filters: positions.map((pos) => ({
        text: pos.name,
        value: pos.name,
      })),
      onFilter: (value, record) => record.position?.name === value,
    },
    {
      title: 'Class',
      dataIndex: ['class', 'title'],
      key: 'class',
      sorter: (a, b) => {
        const classA = a.class?.title || '';
        const classB = b.class?.title || '';
        return classA.localeCompare(classB);
      },
      filters: classes.map((cls) => ({
        text: cls.title,
        value: cls.title,
      })),
      onFilter: (value, record) => record.class?.title === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Фильтруем staff по searchText
  const filteredStaff = staff.filter((item) => {
    if (!searchText) return true;
    return item.name?.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Staff</h1>
        
        {/* Поле для ввода поиска по имени */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />

        <Button type="primary" onClick={handleCreate}>
          Add Staff
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStaff}
        rowKey={(record) => record._id}
        loading={loading}
      />

      <Modal
        title={editingStaff ? 'Edit Staff' : 'Create Staff'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter staff name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: 'Please select position' }]}
          >
            <Select placeholder="Select position">
              {positions.map((pos) => (
                <Option key={pos._id} value={pos._id}>
                  {pos.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Class"
            name="class"
            rules={[{ required: true, message: 'Please select class' }]}
          >
            <Select placeholder="Select class">
              {classes.map((cls) => (
                <Option key={cls._id} value={cls._id}>
                  {cls.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Photos" name="photos">
            <Upload
              beforeUpload={() => false} // Отключаем автозагрузку
              multiple
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffPage;
