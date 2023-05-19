import { Composer } from "grammy";
import { Context } from "../types";
import { getPairsFortWeekCommand } from "../../../commands/get-pairs-weekly";
import { TelegramMessageSender } from "../message-sender";

export const findPairsComposer = new Composer<Context>();

findPairsComposer.hears(/Пары на неделю/i, async (ctx) => {
  let msg = "";
  if (!ctx.session.sub) {
    msg =
      "Сначала подпишитесь на одну из групп, чтобы использовать короткую команду.";
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: msg,
    });
    return;
  }

  const { messages } = await getPairsFortWeekCommand(ctx.session.sub);
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});

findPairsComposer.hears(/Пары \S+ на неделю/i, async (ctx) => {
  const groupName = ctx.message.text.split(" ")[1];

  const { messages } = await getPairsFortWeekCommand(
    ctx.session.sub,
    groupName
  );
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});
