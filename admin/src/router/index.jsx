import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CategoryList from '../pages/Category/CategoryList';
import CategoryForm from '../pages/Category/CategoryForm';
import AuthorList from '../pages/Author/AuthorList';
import AuthorForm from '../pages/Author/AuthorForm';
import ArticleList from '../pages/Article/ArticleList';
import ArticleForm from '../pages/Article/ArticleForm';
import LoginPage from '../pages/LoginPage';
import PrivateRoute from '../guard/PrivateRoute';
import PositionsPage from '../pages/PositionsPage';
import StaffPage from '../pages/StaffPage';
import ClassPage from '../pages/ClassPage';

export default function AppRouter() {
  return (
    <Routes>
       <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute element={MainLayout} />}>
     
        {/* Категории */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryForm />} />
        <Route path="categories/edit/:id" element={<CategoryForm />} />

        {/* Авторы */}
        <Route path="authors" element={<AuthorList />} />
        <Route path="authors/create" element={<AuthorForm />} />
        <Route path="authors/edit/:id" element={<AuthorForm />} />

        {/* Статьи */}
        <Route path="/" index element={<ArticleList />} />
        <Route path="/positions" index element={<PositionsPage />} />
        <Route path="/staff" index element={<StaffPage />} />
        <Route path="/class" index element={<ClassPage />} />
        <Route path="articles/create" element={<ArticleForm />} />
        <Route path="articles/edit/:id" element={<ArticleForm />} />

        {/* Можно добавить NotFound или Redirect */}
      </Route>
    </Routes>
  );
}
