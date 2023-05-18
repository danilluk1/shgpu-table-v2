import { startCommand } from "./../../../commands/start";
import { Composer } from "grammy";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";

export const startComposer = new Composer<Context>();

startComposer.command("start", async (ctx) => {
  const { message } = startCommand();
  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message: message
  });
});
