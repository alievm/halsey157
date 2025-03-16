import React, { useEffect } from 'react';

const GoogleTranslateWidget = () => {
  useEffect(() => {
    // Подключаем скрипт Google Translate
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);

    // Функция инициализации виджета
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'ru', // Язык вашей страницы
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };

    // Добавим CSS-стили, чтобы виджет выглядел аккуратнее
    const style = document.createElement('style');
    style.innerHTML = `
      /* Стили для самого контейнера виджета */
      .goog-te-gadget {
        font-size: 0 !important; /* Убираем слишком большие отступы */
        line-height: normal !important;
      }

      /* Упрощённая версия виджета */
      .goog-te-gadget-simple {
        background-color: #fff !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        padding: 4px !important;
        display: inline-block;
      }

      /* Лого Google + надпись "Выбрать язык" */
      .goog-te-gadget img {
        vertical-align: middle;
        margin-right: 4px;
      }
      .goog-te-gadget-simple .goog-te-menu-value span {
        color: #000 !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }

      /* При наведении на текст убираем подчёркивание */
      .goog-te-gadget-simple .goog-te-menu-value span:hover {
        text-decoration: none !important;
      }

      /* Фон выпадающего списка */
      .goog-te-menu-frame {
        background-color: #fff !important;
        border-radius: 4px !important;
      }

      /* Убираем синию полосу сверху, появляющуюся при переводе */
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
    `;
    document.head.appendChild(style);

    // Убираем скрипт и стили при размонтировании компонента
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return <div className='mt-2' id="google_translate_element" />;
};

export default GoogleTranslateWidget;
