import { Composer } from "grammy";
import { TelegramMessageSender } from "../message-sender";
import { getLinkCommand } from "../../../commands/get-link";
import { Context } from "../types";

export const downloadComposer = new Composer<Context>();

downloadComposer.hears(/Скачать/i, async (ctx) => {
  const { message } = getLinkCommand(ctx.session.sub);
  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message,
  });
});
