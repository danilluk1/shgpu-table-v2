import { Composer } from "grammy";
import { subscribeCommand } from "../../../commands/subscribe";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";
import { Services } from "../../../db/entities/Subscriber";

export const subscribeComposer = new Composer<Context>();

subscribeComposer.hears(/Подпиши на \S+/i, async (ctx) => {
  const groupName = ctx.message.text.split(" ")[2];
  const { message } = await subscribeCommand({
    sub: ctx.session.sub,
    chatId: ctx.chat.id,
    groupName,
    service: Services.TELEGRAM
  });

  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message
  });
});
