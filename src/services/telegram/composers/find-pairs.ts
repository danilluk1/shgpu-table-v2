import { Composer } from "grammy";
import { Context } from "../types";
import { getPairsForWeekCommand } from "../../../commands/get-pairs-weekly";
import { getPairsForTodayCommand } from "../../../commands/get-pairs-today";
import { getPairsForTomorrowCommand } from "../../../commands/get-pairs-tommorow";
import { getPairsForNextWeekCommand } from "../../../commands/get-pairs-next-week";
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

  const { messages } = await getPairsForWeekCommand(ctx.session.sub);
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});

findPairsComposer.hears(/Пары \S+ на неделю/i, async (ctx) => {
  const groupName = ctx.message.text.split(" ")[1];

  const { messages } = await getPairsForWeekCommand(ctx.session.sub, groupName);
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});

findPairsComposer.hears(/Пары сегодня/i, async (ctx) => {
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

  const { messages } = await getPairsForTodayCommand(ctx.session.sub);
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});

findPairsComposer.hears(/Пары на след неделю/i, async (ctx) => {
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

  const { messages } = await getPairsForNextWeekCommand(ctx.session.sub);
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});

findPairsComposer.hears(/Пары завтра/i, async (ctx) => {
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

  const { messages } = await getPairsForTomorrowCommand(ctx.session.sub);
  for (const message of messages) {
    await TelegramMessageSender.sendMessage({
      target: ctx.chat.id,
      message: message,
    });
  }
});
