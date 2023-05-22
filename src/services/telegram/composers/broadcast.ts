import { Composer } from "grammy";
import { Context } from "../types";
import repository from "../../../db/repository";
import { Services } from "../../../db/entities/Subscriber";
import { TelegramMessageSender } from "../message-sender";

export const broadcastComposer = new Composer<Context>();

broadcastComposer.command("broadcast", async (ctx) => {
  const adminsIds = process.env.TELEGRAM_BOT_ADMINS.split(",");

  if (!adminsIds.includes(ctx.chat.id.toString())) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: "Вы не можете использовать эту команду",
    });
    return;
  }

  const broadcastText = ctx.msg.text.slice("/broadcast".length).trim();

  if (!broadcastText) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: "Неверное использование команды, необоходимо ввести текст",
    });
    return;
  }

  const subs = await repository.getServiceSubscribers(Services.TELEGRAM);
  for (const sub of subs) {
    await TelegramMessageSender.sendMessage({
      target: sub.chatId,
      message: broadcastText,
    });
  }
});
