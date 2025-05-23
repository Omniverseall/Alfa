
/**
 * Отправляет сообщение в Telegram бот
 * @param botToken Токен Telegram бота
 * @param chatId ID чата или пользователя
 * @param message Сообщение для отправки
 * @returns Promise с результатом отправки
 */
export const sendTelegramMessage = async (
  botToken: string,
  chatId: string,
  message: string
): Promise<boolean> => {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
};

/**
 * Форматирует данные записи на приём в текстовое сообщение для Telegram
 */
// Удалено formatAppointmentMessage, больше не используется

/**
 * Форматирует данные формы обратной связи в текстовое сообщение для Telegram
 */
export const formatFeedbackMessage = (formData: any, type: "review" | "question"): string => {
  if (type === "review") {
    return `
<b>⭐ Новый отзыв</b>

<b>Имя:</b> ${formData.name}
<b>Телефон:</b> ${formData.phone}
<b>Email:</b> ${formData.email || "Не указан"}
<b>Оценка:</b> ${formData.rating}/5
<b>Текст отзыва:</b> ${formData.text}
`;
  } else {
    return `
<b>❓ Новый вопрос</b>

<b>Имя:</b> ${formData.name}
<b>Телефон:</b> ${formData.phone}
<b>Email:</b> ${formData.email || "Не указан"}
<b>Вопрос:</b> ${formData.question}
`;
  }
};
