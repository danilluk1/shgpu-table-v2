import { Composer } from "grammy";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";
import { helpCommand } from "../../../commands/help";

export const helpComposer = new Composer<Context>();

helpComposer.command("help", async (ctx) => {
  const { message } = helpCommand();
  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message: message,
  });
});

helpComposer.hears(/Помощь/i, async (ctx) => {
  const { message } = helpCommand();
  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message: message,
  });
});
