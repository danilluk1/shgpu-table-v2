import { Composer } from "grammy";
import { unsubscribeCommand } from "../../../commands/unsubscribe";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";

export const unsubscribeComposer = new Composer<Context>();

unsubscribeComposer.hears(/Забудь меня/i, async (ctx) => {
  const { message } = await unsubscribeCommand({
    sub: ctx.session.sub,
  });
  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message,
  });
});
