import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Компонент для защиты маршрутов
const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('tokenHelsey');

    return (
        token ? <Component {...rest} /> : <Navigate to="/login" />
    );
};

export default PrivateRoute;
