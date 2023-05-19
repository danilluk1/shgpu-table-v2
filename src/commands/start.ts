import { Keyboard } from "grammy";

export const startCommand = () => {
  return {
    success: true,
    message: `Добро пожаловать в неофициального бота расписания ШГПУ`,
    kb: new Keyboard([
      ["Пары на неделю", "Пары на след неделю"],
      ["Пары завтра", "Пары сегодня"],
      [{ text: "⌚️ Звонки" }, { text: "💾 Скачать" }, { text: "🆘 Помощь" }],
    ]),
  };
};
