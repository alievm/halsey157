import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';

import Layout from '../components/layouts/Layout';
import ArticlePage from '../pages/ArticlePage';
import Staff from '../pages/Staff';
import StaffDetailPage from '../pages/StaffDetailPage';

const AppRouter = () => (
 <>
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path='/staff' element={<Staff />} />
        <Route index element={<Home />} />
        <Route path="staff/:id" element={<StaffDetailPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Route>
    </Routes>
  </Router>
  <footer className="footer-bg relative bg-white border-t border-gray-200 text-gray-800">
  {/* Основной контейнер */}
  <div className="
        max-w-7xl mx-auto px-4 py-6
        flex flex-col items-center space-y-6
        sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0
      ">
    {/* Левая колонка */}
    <div className="flex  items-center gap-5 sm:items-start text-center sm:text-left space-y-1">
     <div className='flex-col'>
     <h2 className="font-bold text-[#0a0080] text-2xl">Stephen A Halsey JHS 157</h2>
      <p>
        63-55 102nd St.,<br />
        Rego Park, NY 11374
      </p>
      <p>P: (718) 830-4910</p>
     </div>
      {/* Место для QR Code */}
      <img
        src="/Untitled.png"
        alt="QR Code"
        className="h-[100px] w-auto"/>
    </div>

    {/* Центральная колонка (логотип) */}
    <div className="flex lg:order-none order-first justify-center items-center">
      <img
        src="/school_logo.png"
        alt="School Logo"
        className="h-[180px] z-[999] w-auto"
      />
    </div>

    {/* Правая колонка */}
    <div className="flex gap-5 items-center sm:items-end text-center sm:text-right space-y-2">
      <div className="flex flex-col items-start text-gray-500">
        <a
          href="https://www.schools.nyc.gov/about-us/policies/non-discrimination-policy"
          className="hover:underline"
        >
          Non-Discrimination Statement
        </a>
        <a href="#" className="hover:underline">
          Web Accessibility Statement
        </a>
      </div>
      <a href="https://www.schools.nyc.gov/">
        <img
          src="/NYC_DOE_Logo.png"
          alt="NYC Department of Education"
          className="h-[90px] w-auto"
        />
      </a>
    </div>
  </div>

  {/* Нижний блок с подписью */}
  <div className="text-center text-sm my-4">
  Designed and Created by Sabrina Berdieva
  ©2023 Stephen A. Halsey J.H.S. 157. All Rights Reserved
  </div>
</footer>



 </>
);

export default AppRouter;