import { Composer } from "grammy";
import { getTimeTableCommand } from "../../../commands/get-timeTable";
import { TelegramMessageSender } from "../message-sender";
import { Context } from "../types";

export const timeTableComposer = new Composer<Context>();

timeTableComposer.hears(/Звонки/i, async (ctx) => {
  const { message } = getTimeTableCommand();
  await TelegramMessageSender.sendMessage({
    target: ctx.chat.id,
    message,
  });
});
