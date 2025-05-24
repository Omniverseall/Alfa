import React, { useEffect } from "react";

interface ExternalServicesProps {
  amoCrmId: string;      // Ваш ID виджета amoCRM, например "428983"
  amoCrmHash: string;    // Хэш виджета amoCRM
  amoCrmLocale?: string; // Локаль, по умолчанию "ru"
  // Можно добавить и другие параметры, если они есть в вашем скрипте amoCRM
}

const ExternalServices: React.FC<ExternalServicesProps> = ({
  amoCrmId,
  amoCrmHash,
  amoCrmLocale = "ru", // Значение по умолчанию для локали
}) => {
  useEffect(() => {
    // Проверяем, не был ли скрипт уже добавлен, чтобы избежать дублирования
    // (ID скрипта 'amo_social_button_script' берем из оригинального скрипта amoCRM)
    if (document.getElementById("amo_social_button_script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "amo_social_button_script"; // Этот ID используется в оригинальном скрипте
    script.async = true;

    // Формируем тело скрипта, используя переданные пропсы
    script.innerHTML = `
      (function (a, m, o, c, r, am) { // Изменено имя последней переменной на 'am' во избежание конфликта
        a[am] = {
          id: "${amoCrmId}",
          hash: "${amoCrmHash}",
          locale: "${amoCrmLocale}",
          inline: false,
          setMeta: function (p) {
            this.params = (this.params || []).concat([p]);
          }
        };
        a[o] = a[o] || function () {
          (a[o].q = a[o].q || []).push(arguments);
        };
        var d = a.document,
          s = d.createElement('script');
        s.async = true;
        s.id = am + '_script'; // Убедимся, что ID скрипта уникален и соответствует логике amoCRM
        s.src = 'https://gso.amocrm.ru/js/button.js';
        if (d.head) { // Проверка на существование d.head
          d.head.appendChild(s);
        } else { // Если d.head еще не доступен, ждем загрузки DOM
          d.addEventListener('DOMContentLoaded', function() {
            if(d.head) d.head.appendChild(s);
          });
        }
      })(window, 0, 'amoSocialButton', 0, 0, 'amo_social_button');
    `;

    document.body.appendChild(script); // Добавляем скрипт в body для инициализации

    // Функция очистки, которая может попытаться удалить скрипт при размонтировании,
    // но это не всегда эффективно для сторонних скриптов, которые модифицируют DOM.
    return () => {
      const existingScript = document.getElementById("amo_social_button_script");
      if (existingScript && existingScript.parentNode) {
        // existingScript.parentNode.removeChild(existingScript); // Закомментировано, т.к. удаление может быть нежелательным
      }
      // Сброс глобальных переменных amoCRM (если это необходимо и безопасно)
      // delete window.amo_social_button;
      // delete window.amoSocialButton;
    };
  }, [amoCrmId, amoCrmHash, amoCrmLocale]); // Зависимости useEffect

  return null; // Компонент не рендерит видимый HTML, только добавляет скрипт
};

export default ExternalServices;