// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;

// Компонент-счётчик
function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.total <= 0) {
    return <span>Expired</span>;
  }

  return (
    <span>
      {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </span>
  );
}

function calculateTimeLeft(deadline) {
  const total = deadline - new Date();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor(total / (1000 * 60 * 60));
  return {
    total,
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [morningAnnouncements, setMorningAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Фетч для категорий и статей
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, articlesRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/articles'),
        ]);
        setCategories(categoriesRes.data);
        const sortedArticles = articlesRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фетч для утренних объявлений
  useEffect(() => {
    const fetchMorningAnnouncements = async () => {
      try {
        setLoadingAnnouncements(true);
        const res = await axios.get('/morning-announcements');
        setMorningAnnouncements(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchMorningAnnouncements();
  }, []);

  // Фильтрация статей
  const filteredArticles = articles.filter((article) => {
    let dateMatch = true;
    let categoryMatch = true;

    if (dateRange && dateRange.length === 2) {
      const createdAt = new Date(article.createdAt);
      dateMatch =
        createdAt >= dateRange[0].toDate() && createdAt <= dateRange[1].toDate();
    }

    if (selectedCategory) {
      categoryMatch = article.category._id === selectedCategory;
    }

    return dateMatch && categoryMatch;
  });

  const getStaffNames = (staff) =>
    staff && staff.length > 0 ? staff.map((member) => member.name).join(', ') : '—';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Мобильная версия блока Morning Announcements */}
      <div className="md:hidden mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg relative flex items-center justify-between font-bold text-gray-800 border-b-2 border-[#0a0080] pb-2 mb-4">
            Morning Announcements
            <img
              src="/presentation-board-megaphone-speaker-3d-render-illustration-minimal-cartoon-style-isolated-white-background.png"
              className="h-14 absolute right-0"
              alt="Morning Announcements"
            />
          </h2>
          <div className="h-64 text_rev_card_text p-2 overflow-y-auto space-y-4 mb-8">
            {loadingAnnouncements ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded shadow animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))
            ) : morningAnnouncements.length > 0 ? (
              morningAnnouncements.map((announcement) => {
                const expirationTime = new Date(
                  new Date(announcement.createdAt).getTime() + 24 * 60 * 60 * 1000
                );
                return (
                  <div
                    key={announcement._id}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold title text-base">{announcement.title}</h3>
                    <p className="text-gray-600 tag text-sm" dangerouslySetInnerHTML={{ __html: announcement.description }}></p>
                    <div className="mt-2 text-xs text-gray-400">
                      <div>
                        Created: {new Date(announcement.createdAt).toLocaleString()}
                      </div>
                      <div>
                        Expires in: <CountdownTimer deadline={expirationTime} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
             <div className='relatie'>
              <span class="loader"></span>
               <p className="text-gray-500">No announcements found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Основная область (две колонки) */}
      <div className="flex flex-col relative md:flex-row gap-4">
        {/* Левая колонка (главная статья) */}
        <div className="md:w-3/5 h-full flex flex-col gap-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="rounded-lg bg-gray-300 w-full h-64 md:h-96"></div>
              <div className="mt-4">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
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
                <p
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: articles[0].description }}
                ></p>
               <Link to={`/staff/${articles[0].staff[0]._id}`} className="flex items-center space-x-3 mt-4">
               <div className="flex -space-x-2">
    {articles[0].staff.map((staffMember) => (
      <Link key={staffMember._id} to={`/staff/${staffMember._id}`}>
        <img
          src={`${BASE_URL}${staffMember.photos[0]}`}
          alt={staffMember.name}
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </Link>
    ))}
  </div>

  <div className="text-sm">
    <p className="font-semibold text-gray-800">
      {getStaffNames(articles[0].staff)}
    </p>
    <p className="text-gray-500">
      {new Date(articles[0].createdAt).toLocaleDateString()}
    </p>
  </div>
</Link>
              </>
            )
          )}
        </div>

        {/* Правая колонка */}
        <div className="md:w-2/5">
          {/* Версия для desktop: Morning Announcements */}
          <div className="hidden md:block">
            <h2 className="text-2xl relative flex items-center justify-between font-bold text-gray-800 border-b-2 border-[#0a0080] pb-2 mb-4">
              Morning Announcements
              <img
                src="/presentation-board-megaphone-speaker-3d-render-illustration-minimal-cartoon-style-isolated-white-background.png"
                className="h-14 absolute right-0 object-cover"
                alt="Morning Announcements"
              />
            </h2>
            <div className="h-64 text_rev_card_text p-2 overflow-y-auto space-y-4 mb-8">
              {loadingAnnouncements ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded shadow animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))
              ) : morningAnnouncements.length > 0 ? (
                morningAnnouncements.map((announcement) => {
                  const expirationTime = new Date(
                    new Date(announcement.createdAt).getTime() + 24 * 60 * 60 * 1000
                  );
                  return (
                    <div
                      key={announcement._id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold title text-base">{announcement.title}</h3>
                      <p className="text-gray-600 tag text-sm" dangerouslySetInnerHTML={{ __html: announcement.description }}></p>
                      <div className="mt-2 text-xs text-gray-400">
                        <div>
                          Created: {new Date(announcement.createdAt).toLocaleString()}
                        </div>
                        <div>
                          Expires in: <CountdownTimer deadline={expirationTime} />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='relatie'>
              <span class="loader"></span>
               <p className="text-gray-500">No announcements found.</p>
              </div>
              )}
            </div>
          </div>

          {/* Секция Recent stories */}
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-[#0a0080] pb-2 mb-4">
            Recent stories
          </h2>
          <div className="flex flex-col space-y-6">
            {loading
              ? [1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3 animate-pulse">
                    <div className="overflow-hidden">
                      <div className="w-60 h-32 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                ))
              : articles.slice(1, 4).map((story) => (
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
                  <Link key={story._id} to={`/article/${story._id}`}>
                  <h3 className="font-semibold title hover:underline text-gray-800 text-sm sm:text-base">
                    {story.title}
                  </h3>
                   </Link>
                  <p
                    className="text-gray-600 mt-2 line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: story.description }}
                  ></p>
                  <p className="text-xs text-gray-500">
                    By {getStaffNames(story.staff)} &bull;{' '}
                    {new Date(story.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

                
                ))}
          </div>
        </div>
      </div>

      {/* Секция All Articles */}
      <section className="mt-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">All Articles</h2>
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
            <RangePicker
              size="large"
              className="w-full lg:w-auto"
              onChange={(dates) => setDateRange(dates)}
            />
             <div className="relative inline-block text-left w-full">
      <button
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        className="bg-[#0a0080] text-white py-2 cursor-pointer px-4 rounded flex items-center justify-between w-full focus:outline-none"
      >
        <span>
          {selectedCategory
            ? categories.find((cat) => cat._id === selectedCategory)?.name
            : 'Select interest'}
        </span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-full lg:max-w-[22rem] max-w-full overflow-hidden bg-[#0a0080] rounded-md shadow-lg transition-all duration-200 transform ${
          dropdownOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
        }`}
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="px-4 py-2 text-white hover:bg-blue-900 cursor-pointer"
            onClick={() => {
              setSelectedCategory(cat._id);
              setDropdownOpen(false);
            }}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow animate-pulse">
                <div className="bg-gray-300 h-40 w-full"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center">
              <img src="/Yuppies Managing.png" alt="No articles found" className="w-[400px] h-[400px] object-contain" />
              <p className="text-lg text-gray-500">No articles found</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <Link key={article._id} to={`/article/${article._id}`}>
              <div className="rounded-lg group overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 flex flex-col h-96">
                <img
                  src={`${BASE_URL}${article.photo}`}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-[#fff] bg-[#0a0080] max-w-max px-2 py-1 rounded tag text-xs font-medium">
                    {article.category.name}
                  </span>
                  <h3 className="font-bold title group-hover:underline text-lg mt-2 line-clamp-1">
  {article.title}
</h3>
                  <p
                    className="text-gray-600 mt-2 line-clamp-3 flex-grow"
                    dangerouslySetInnerHTML={{ __html: article.description }}
                  ></p>
                 <div className="flex items-center mt-4">
  {/* Группа аватаров сотрудников */}
  <div className="flex -space-x-2">
    {article.staff.map((staffMember) => (
      <Link key={staffMember._id} to={`/staff/${staffMember._id}`}>
        <img
          src={`${BASE_URL}${staffMember.photos[0]}`}
          alt={staffMember.name}
          className="w-8 h-8 rounded-full border-2 border-white"
        />
      </Link>
    ))}
  </div>
  {/* Информация о сотрудниках и дата статьи */}
  <div className="ml-4 text-xs text-gray-500">
    <p>{getStaffNames(article.staff)}</p>
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
