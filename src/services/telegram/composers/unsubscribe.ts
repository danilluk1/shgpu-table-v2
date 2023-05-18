import { Composer } from "grammy";
import { unsubscribeCommand } from "../../../commands/unsubscribe";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";

export const unsubscribeComposer = new Composer<Context>();

unsubscribeComposer.hears(/(?i)Забудь меня/, async (ctx) => {
  const { message } = await unsubscribeCommand({
    sub: ctx.session.sub
  });

  await TelegramMessageSender.sendMessage({
    target: ctx.session.sub.chatId,
    message
  });
});
