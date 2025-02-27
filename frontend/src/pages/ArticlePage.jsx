import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;

const ArticlePage = () => {
  const { id } = useParams(); // Получаем id статьи из URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (error) {
        console.error(error);
        // Здесь можно добавить уведомление об ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  let readingTime = 0;
  if (article && article.description) {
    const words = article.description.trim().split(/\s+/).length;
    readingTime = Math.ceil(words / 200); // 200 слов в минуту
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {loading ? (
        // Skeleton Loader для статьи
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded-lg" />
          <div className="mt-6">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
          </div>
          <div className="flex items-center mt-6">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="ml-4">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-1/4" />
            </div>
          </div>
        </div>
      ) : article ? (
        // Отображение детальной информации об статье
        <div>
              <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-reset flex text-gray-600">
              <li>
                <Link to="/" className="hover:text-gray-800">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-500">{article.title}</li>
            </ol>
          </nav>

          <img
            src={`${BASE_URL}${article.photo}`}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="mt-6">
            <span className="text-[#fff] bg-[#0a0080] max-w-max px-2 py-1 rounded tag text-xs  font-semibold ">
              {article.category.name}
            </span>
            <h1 className="text-3xl title font-bold text-gray-800 mt-2">
              {article.title}
            </h1>
            <div className="flex items-center mt-8">
              <img
                src="/vector-flat-illustration-grayscale-avatar-600nw-2281862025.webp"
                alt={article.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-2 flex items-center gap-2">
                <p className="text-gray-800 font-semibold"><span className='font-normal text-gray-700'>By</span> {article.author.name}</p>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="dHctbWwtNA dHctaC0[18px] dHctdy0[18px] dHctdGV4dC1ncmF5LTQwMA"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path></svg>
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="dHctbWwtMw dHctaC0[18px] dHctdy0[18px] dHctdGV4dC1ncmF5LTQwMA"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {readingTime} min read
                </p>
              </div>
            </div>

            <div className="mt-4 text-gray-700 space-y-4">
  {article.description.split('\n').map((paragraph, idx) => (
    <p key={idx} className="first-letter:text-4xl first-letter:font-bold first-letter:pr-2">
      {paragraph}
    </p>
  ))}
</div>
           
          </div>
        </div>
      ) : (
        <p>Article not found.</p>
      )}
    </div>
  );
};

export default ArticlePage;
