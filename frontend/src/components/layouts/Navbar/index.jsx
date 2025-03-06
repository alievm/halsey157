import React, {useState, useEffect} from 'react'
import Marquee from 'react-fast-marquee'
import { Link } from 'react-router-dom';
import axios from '../../../api/axios';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export const Navbar = () => {
        const [articles, setArticles] = useState([]);
        const [loading, setLoading] = useState(false);


        const fetchArticles = async () => {
            try {
              setLoading(true);
              const res = await axios.get('/articles'); 
              // Sort articles by createdAt in descending order (newest first)
              const sortedArticles = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              setArticles(sortedArticles);
            } catch (error) {
              console.error(error);
              message.error('Error fetching articles');
            } finally {
              setLoading(false);
            }
          };
          
            
              useEffect(() => {
                fetchArticles();
              }, []);


return (
    <>
         <div className="bg-[#0a0080] h-[100px] py-6 w-full gap-5 flex justify-between items-center lg:px-20 px-5">
         <div className="gap-3 flex justify-start items-center">
  {/* Логотип */}
  <img src="/school_logo.png" alt="logo" className="h-[70px] lg:h-[85px]" />

  {/* Название школы */}
  <h2 className="font-semibold tag text-white lg:text-xl text-base">
  Halsey 157 News 
  </h2>
</div>

      <div className="flex items-center gap-5">
        <Link className="text-white text-base bg-white/10 p-2 rounded tag" to="/">
          Homepage
        </Link>
        <Link className="text-white text-base bg-white/10 p-2 rounded tag" to="/staff">
          Staff Members
        </Link>
        <div className="lg:flex hidden gap-3">
          <a
            href="https://www.facebook.com/Halsey157pa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-white text-2xl" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-white text-2xl" />
          </a>
        </div>
      </div>
    </div>
        <div className="bg-[#080061] py-2 w-full">
        {loading ? (
          // Скелетон, пока данные ещё загружаются
          <Marquee>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="text-white font-medium uppercase text-sm px-4 flex items-center"
              >
                <div className="w-[300px] h-5 bg-[#0d0194] rounded animate-pulse" />
              </div>
            ))}
          </Marquee>
        ) : (
          // Когда данные загружены, показываем реальные статьи
          <Marquee pauseOnHover={true}>
            {articles.map((article, index) => (
              <div
                key={index}
                className="text-white tag will-change-auto font-medium uppercase text-sm px-4"
              >
                {article.title}
              </div>
            ))}
          </Marquee>
        )}
      </div>


      
    </>
)
}
