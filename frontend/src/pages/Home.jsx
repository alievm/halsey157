import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { DatePicker, Select } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Общий фетч для категорий и статей
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Запускаем оба запроса параллельно
        const [categoriesRes, articlesRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/articles'),
        ]);

        setCategories(categoriesRes.data);
        // Сортируем статьи по дате создания
        const sortedArticles = articlesRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error(error);
        // message.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фильтрация статей для секции "All Articles" по дате и категории
  const filteredArticles = articles.filter(article => {
    let dateMatch = true;
    let categoryMatch = true;

    if (dateRange && dateRange.length === 2) {
      const createdAt = new Date(article.createdAt);
      dateMatch =
        createdAt >= dateRange[0].toDate() && createdAt <= dateRange[1].toDate();
    }

    if (selectedCategory) {
      // Предполагается, что article.category является объектом с _id
      categoryMatch = article.category._id === selectedCategory;
    }

    return dateMatch && categoryMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Секция категорий */}
      {/* <section className="pb-8">
        ...код категорий...
      </section> */}

      {/* Основная область (две колонки) */}
      <div className="flex flex-col relative md:flex-row gap-4">
        {/* Левая колонка (главная статья) */}
        <div className="md:w-3/5 h-full flex flex-col gap-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="rounded-lg bg-gray-300 w-full h-64 md:h-96 animate-pulse" />
              <div className="mt-4">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-2/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            articles.length > 0 && (
              <>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={`${BASE_URL}${articles[0].photo}`}
                    alt={articles[0].title}
                    className="object-cover w-full h-64 md:h-96 transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <span className="text-[#fff] bg-[#0a0080] max-w-max px-2 py-1 rounded tag text-xs font-medium">
                  {articles[0].category.name}
                </span>
                <h1 className="text-2xl title sm:text-3xl font-bold text-gray-800">
                  {articles[0].title}
                </h1>
                <p className="text-gray-600">{articles[0].description}</p>
                <div className="flex items-center space-x-3 mt-4">
                  <img
                    src="/vector-flat-illustration-grayscale-avatar-600nw-2281862025.webp"
                    alt={articles[0].author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">
                      {articles[0].author.name}
                    </p>
                    <p className="text-gray-500">
                      {new Date(articles[0].createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )
          )}
        </div>

        {/* Правая колонка (Recent stories) */}
        <div className="md:w-2/5">
          <h2 className="text-2xl tag font-bold text-gray-800 border-b-2 border-[#0a0080] pb-2 mb-4">
            Recent stories
          </h2>
          <div className="flex flex-col space-y-6">
            {loading
              ? [1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3 animate-pulse">
                    <div className="overflow-hidden">
                      <div className="w-60 h-32 bg-gray-300 rounded animate-pulse" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                ))
              : articles.slice(1, 6).map((story) => (
                  <Link key={story._id} to={`/article/${story._id}`}>
                    <div className="flex items-start gap-3">
                      <div className="overflow-hidden rounded w-48 h-32 flex-none">
                        <img
                          src={`${BASE_URL}${story.photo}`}
                          alt={story.title}
                          className="w-full h-full object-cover rounded transform transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#fff] bg-[#0a0080] max-w-max px-2 py-1 rounded tag text-xs font-medium">
                          {story.category.name}
                        </span>
                        <h3 className="font-semibold title text-gray-800 text-sm sm:text-base">
                          {story.title}
                        </h3>
                        <p className="text-gray-600 mt-2 line-clamp-1">
                          {story.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          By {story.author.name} &bull;{' '}
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>

      <section className="mt-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl tag font-bold text-gray-800">All Articles</h2>
    <div className="flex gap-4 space-x-4">
      <RangePicker
        size="large"
        onChange={(dates) => setDateRange(dates)}
      />
      <Select
        placeholder="Select interest"
        style={{ width: 200 }}
        size="large"
        onChange={(value) => setSelectedCategory(value)}
        allowClear
      >
        {categories.map((cat) => (
          <Option key={cat._id} value={cat._id}>
            {cat.name}
          </Option>
        ))}
      </Select>
    </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {loading ? (
      Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden shadow animate-pulse"
        >
          <div className="bg-gray-300 h-40 w-full" />
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ))
    ) : filteredArticles.length === 0 ? (
      <div className="col-span-full flex flex-col items-center">
        <img
          src="/Yuppies Managing.png"
          alt="No articles found"
          className="w-[400px] h-[400px] object-contain"
        />
        <p className="text-lg text-gray-500">No articles found</p>
      </div>
    ) : (
      filteredArticles.map((article) => (
        <Link key={article._id} to={`/article/${article._id}`}>
          <div className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
            <img
              src={`${BASE_URL}${article.photo}`}
              alt={article.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <span className="text-[#fff] bg-[#0a0080] max-w-max px-2 py-1 rounded tag text-xs font-medium">
                {article.category.name}
              </span>
              <h3 className="font-bold title text-lg mt-2">
                {article.title}
              </h3>
              <p className="text-gray-600 mt-2 line-clamp-3">
                {article.description}
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="/vector-flat-illustration-grayscale-avatar-600nw-2281862025.webp"
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="text-xs text-gray-500">
                  <p>{article.author.name}</p>
                  <p>{new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))
    )}
  </div>
</section>

    </div>
  );
};

export default Home;
