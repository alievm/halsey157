import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Form, Input, Button, Alert } from 'antd';

const ChangePasswordPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const { currentPassword, newPassword } = values;
        try {
            const token = localStorage.getItem('tokenHelsey');
            const response = await axios.put('/auth/change-password', { currentPassword, newPassword }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess(response.data.message);
            setError('');
            // Optionally, redirect the user after a successful password change
            // navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Error changing password');
            setSuccess('');
        }
    };

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full border border-gray-300 rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    )}
                    {success && (
                        <Alert
                            message={success}
                            type="success"
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    )}
                    <Form
                        name="change_password_form"
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Current Password"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Please enter your current password!' }]}
                        >
                            <Input.Password placeholder="Enter current password" />
                        </Form.Item>
                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[{ required: true, message: 'Please enter your new password!' }]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>
                        <Form.Item
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            dependencies={['newPassword']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm new password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
