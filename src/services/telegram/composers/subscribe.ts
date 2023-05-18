import { Composer } from "grammy";
import { subscribeCommand } from "../../../commands/subscribe";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";

export const subscribeComposer = new Composer<Context>();

subscribeComposer.hears(/(?i)Подпиши на \S+/, async (ctx) => {
  const groupName = ctx.match[1];

  const { message } = await subscribeCommand({
    sub: ctx.session.sub,
    groupName
  });

  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message
  });
});
