import { Composer } from "grammy";
import { subscribeCommand } from "../../../commands/subscribe-lector";
import { Context } from "../types";
import { TelegramMessageSender } from "../message-sender";

export const subscribeLectorComposer = new Composer<Context>();

subscribeLectorComposer.hears(/Подпиши на \S+/i, async (ctx) => {
  // const groupName = ctx.message.text.split(" ")[2];
  // const { message } = await subscribeCommand({
  //   sub: ctx.session.sub,
  //   chatId: ctx.chat.id,
  //   groupName
  // });
  // await TelegramMessageSender.sendMessage({
  //   target: ctx.chat.id,
  //   message
  // });
});
