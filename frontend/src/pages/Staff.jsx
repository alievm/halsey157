// src/pages/StaffGridPage.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // Ваш настроенный axios instance
import { Link } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_DIRECTORY_URL;

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  // Получаем список сотрудников с фильтром по классу
  const fetchStaff = async () => {
    try {
      setLoading(true);
      let url = '/staff';
      if (selectedClass) {
        url += `?class=${selectedClass}`;
      }
      const res = await axios.get(url);
      setStaff(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Получаем список классов
  const fetchClasses = async () => {
    try {
      const res = await axios.get('/classes');
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [selectedClass]);

  return (
    <>
      {/* Верхняя часть с фильтром */}
      <div className="max-w-7xl mx-auto p-8">
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
            <li className="text-gray-500">{selectedClass
      ? classes.find((cls) => cls._id === selectedClass)?.title
      : "All Staff Members"}</li>
          </ol>
        </nav>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl tag font-bold text-gray-800">
            All Staff Members
          </h2>
          {/* Кастомное темное меню */}
          <div className="relative inline-block text-left group">
            <button className="bg-[#0b0080] text-white py-2 px-4 rounded-md focus:outline-none flex items-center">
              {selectedClass
                ? classes.find((cls) => cls._id === selectedClass)?.title
                : "Select a class"}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute overflow-hidden right-0 mt-2 w-48 bg-[#0b0080] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              {/* <div
                className="px-4 py-2 text-white hover:bg-blue-900 cursor-pointer"
                onClick={() => setSelectedClass("")}
              >
                All Classes
              </div> */}
              {classes.map((cls) => (
                <div
                  key={cls._id}
                  className="px-4 py-2 text-white hover:bg-blue-900 cursor-pointer"
                  onClick={() => setSelectedClass(cls._id)}
                >
                  {cls.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded overflow-hidden animate-pulse"
              >
                <div className="grid grid-cols-2 gap-1">
                  {/* Левая колонка */}
                  <div className="bg-gray-300 w-full h-[305px]"></div>
                  {/* Правая колонка */}
                  <div className="flex flex-col gap-1">
                    <div className="bg-gray-300 w-full h-[150px]"></div>
                    <div className="bg-gray-300 w-full h-[150px]"></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            staff.map((person) => (
              <Link key={person._id} to={`/staff/${person._id}`} className="block">
                <div className="bg-gray-100 rounded overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Верхняя часть карточки: коллаж из 3 фото */}
                  <div className="grid grid-cols-1 gap-1">
                    {person.photos?.[0] ? (
                      <img
                        src={`${BASE_URL}${person.photos[0]}`}
                        alt={person.name}
                        className="object-cover w-full h-[305px] filter"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                        No photo
                      </div>
                    )}
                  </div>

                  {/* Нижняя часть карточки: имя, должность и описание */}
                  <div>
                    <div
                      style={{
                        background: 'url(/ип.svg) no-repeat center center/cover',
                      }}
                      className="p-4"
                    >
                      <h3 className="text-2xl text-white font-bold my-custom-text">
                        {person.name}
                      </h3>
                    </div>
                    {person.position?.name && (
                      <p className="text-[#fff] bg-[#0a0080] max-w-max px-2 py-1 rounded tag text-sm font-medium my-2 mx-auto">
                        {person.position.name}
                      </p>
                    )}
                    <h3 className="text-xl text-center tag font-semibold">
                      {person.name}
                    </h3>
                    <div className="p-2 text-center">
                      <p className="text-gray-700 line-clamp-3">
                        {person.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Staff;
