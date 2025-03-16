import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Form, Input, Button, Alert } from 'antd';

const LoginPage = () => {
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            if (isRegister) {
                // Регистрируем пользователя
                const { username, password } = values;
                await axios.post(`/auth/register`, { username, password });
                alert('Регистрация успешна. Пожалуйста, войдите.');
                setIsRegister(false);
            } else {
                // Логин пользователя
                const { username, password } = values;
                const response = await axios.post(`/auth/login`, { username, password });
                localStorage.setItem('tokenHelsey', response.data.token);
                navigate('/');
            }
            setError('');
        } catch (err) {
            setError(isRegister ? 'Ошибка регистрации' : 'Неверный username или пароль');
        }
    };

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
                            <h2>{isRegister ? 'Register' : 'Login'}</h2>
                            {error && (
                                <Alert
                                    message={error}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: '20px' }}
                                />
                            )}
                            <Form
                                name={isRegister ? "register_form" : "login_form"}
                                onFinish={handleSubmit}
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input type="text" placeholder="Enter your username" />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password placeholder="Enter your password" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        {isRegister ? 'Register' : 'Login'}
                                    </Button>
                                </Form.Item>
                            </Form>
                            {/* <div style={{ textAlign: 'center' }}>
                                {isRegister ? (
                                    <p>
                                        Already have an account?{' '}
                                        <Button type="link" onClick={() => setIsRegister(false)}>
                                            Login here
                                        </Button>
                                    </p>
                                ) : (
                                    <p>
                                        Don't have an account?{' '}
                                        <Button type="link" onClick={() => setIsRegister(true)}>
                                            Register here
                                        </Button>
                                    </p>
                                )}
                            </div> */}
                        </div>
                    </div>
                    <div className="max-md:mt-8">
                        <img
                            src="/school_logo.png"
                            className="w-full max-md:w-4/5 mx-auto block"
                            alt="School Logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
