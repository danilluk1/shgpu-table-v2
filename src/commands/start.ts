import { Keyboard } from "grammy";

export const startCommand = () => {
  return {
    success: true,
    message: `Добро пожаловать в неофициального бота расписания ШГПУ`,
    kb: [
      [{ text: "Пары на неделю" }, { text: "Пары на след неделю" }],
      [{ text: "Пары завтра" }, { text: "Пары сегодня" }],
      [{ text: "⌚️ Звонки" }, { text: "💾 Скачать" }, { text: "🆘 Помощь" }]
    ]
  };
};
