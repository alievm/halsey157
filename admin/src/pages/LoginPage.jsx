import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Form, Input, Button, Alert } from 'antd';

const LoginPage = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (values) => {
        const { username, password } = values;
        try {
            // Отправляем запрос на логин
            const response = await axios.post(`/auth/login`, { username, password });
            // Сохраняем токен в localStorage
            localStorage.setItem('tokenHelsey', response.data.token);
            // Перенаправляем на главную страницу после успешного логина
            navigate('/');
        } catch (error) {
            setError('Неверный логин или пароль');
        }
    };

    return (

        <div className="font-[sans-serif]">
            <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                    <div
                        className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <div style={{maxWidth: 400, margin: '0 auto', padding: '20px'}}>
                            <h2>Login</h2>
                            {error && <Alert message={error} type="error" showIcon style={{marginBottom: '20px'}}/>}
                            <Form
                                name="login_form"
                                onFinish={handleSubmit}
                                initialValues={{
                                    remember: true,
                                }}
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[{required: true, message: 'Please input your username!'}]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Enter your username"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{required: true, message: 'Please input your password!'}]}
                                >
                                    <Input.Password
                                        placeholder="Enter your password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        Login
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div className="max-md:mt-8">
                        <img
                            src="/school_logo.png"
                            className="w-full  max-md:w-4/5 mx-auto block "
                            alt="Dining Experience"
                        />
                    </div>
                </div>
            </div>
        </div>


    )
        ;
};

export default LoginPage;
