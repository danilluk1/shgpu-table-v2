import { Composer } from "grammy";
import { Context } from "../types";

export const subscribeLectorComposer = new Composer<Context>();

// subscribeLectorComposer.hears(/Подпиши на препод .+/i, async (_) => {
//   //const _ = ctx.message.text.split(" ")[3];
//   // const groupName = ctx.message.text.split(" ")[2];
//   // const { message } = await subscribeCommand({
//   //   sub: ctx.session.sub,
//   //   chatId: ctx.chat.id,
//   //   groupName
//   // });
//   // await TelegramMessageSender.sendMessage({
//   //   target: ctx.chat.id,
//   //   message
//   // });
// });
