import { Keyboard } from "vk-io";

export const startVKCommand = () => {
  const keyboard = Keyboard.keyboard([
    [
      Keyboard.textButton({ label: "Пары на неделю" }),
      Keyboard.textButton({ label: "Пары на следующую неделю" })
    ],
    [
      Keyboard.textButton({ label: "Пары завтра" }),
      Keyboard.textButton({ label: "Пары сегодня" })
    ],
    [
      Keyboard.textButton({ label: "⌚️ Звонки" }),
      Keyboard.textButton({ label: "💾 Скачать" }),
      Keyboard.textButton({ label: "🆘 Помощь" })
    ]
  ]);

  return {
    success: true,
    message: `Добро пожаловать в неофициального бота расписания ШГПУ`,
    kb: keyboard
  };
};
