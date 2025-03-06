// src/pages/StaffDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;

const StaffDetailPage = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Получаем полную информацию о сотруднике
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoadingStaff(true);
        const res = await axios.get(`/staff/${id}`);
        setStaff(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, [id]);

  // Получаем статьи, созданные данным сотрудником
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const res = await axios.get(`/staff/${id}/articles`);
        setArticles(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingArticles(false);
      }
    };
    fetchArticles();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Информация о сотруднике */}
      {loadingStaff ? (
        <div className="mb-8 animate-pulse">
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-reset flex text-gray-400">
              <li className="bg-gray-300 rounded w-24 h-4"></li>
              <li className="mx-2">/</li>
              <li className="bg-gray-300 rounded w-32 h-4"></li>
            </ol>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gray-300"></div>
            <div>
              <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-80"></div>
            </div>
          </div>
        </div>
      ) : staff ? (
        <div className="mb-8">
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-reset flex text-gray-600">
              <li>
                <Link to="/staff" className="hover:text-gray-800">
                  Staff Members
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-500">{staff.name}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4">
            {staff.photos && staff.photos.length > 0 ? (
              <img
                src={`${BASE_URL}${staff.photos[0]}`}
                alt={staff.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                No photo
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{staff.name}</h1>
              {staff.position && (
                <p className="text-lg text-gray-600">{staff.position.name}</p>
              )}
              <p className="mt-2">{staff.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Staff not found.</p>
      )}

      {/* Статьи сотрудника */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Articles by {staff ? staff.name : ''}
        </h2>
        {loadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded overflow-hidden shadow animate-pulse"
              >
                <div className="bg-gray-300 h-40 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article._id} to={`/article/${article._id}`}>
                <div className="rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                  {article.photo && (
                    <img
                      src={`${BASE_URL}${article.photo}`}
                      alt={article.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{article.title}</h3>
                    <p
                      className="text-gray-600 mt-2 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: article.description }}
                    ></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default StaffDetailPage;
