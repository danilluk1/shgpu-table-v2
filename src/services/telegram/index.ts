import { Bot, session } from "grammy";
import { Context } from "./types";
import { ServiceInterface } from "../_interface";
import { Services } from "../../db/entities/Subscriber";
import { error, warning } from "../../libs/logger";
import { limit } from "@grammyjs/ratelimiter";
import { addSubscriberMiddleware } from "./middlewares/add-subscriber";
import { subscribeComposer } from "./composers/subscribe";
import { unsubscribeComposer } from "./composers/unsubscribe";
import { sessionMiddleware } from "./middlewares/session";
import { startComposer } from "./composers/start";
import { helpComposer } from "./composers/help";
import { timeTableComposer } from "./composers/timeTable-composer";
import { downloadComposer } from "./composers/download";

class TelegramService extends ServiceInterface {
  bot: Bot<Context>;

  constructor() {
    super({
      service: Services.TELEGRAM,
    });

    const accessToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!accessToken) {
      warning(
        "TELEGRAM: bot token not setuped, telegram library will not work."
      );
      return;
    }

    this.bot = new Bot<Context>(accessToken);
    this.bot.use(sessionMiddleware);
    this.bot.use(
      limit({
        timeFrame: 2000,
        limit: 3,
        onLimitExceeded: (ctx) => {
          ctx?.reply("Не так быстро, вы не один.");
        },
        keyGenerator: (ctx) => {
          return ctx.from?.id.toString();
        },
      })
    );
    this.bot.use(addSubscriberMiddleware);
    this.bot.use(subscribeComposer);
    this.bot.use(unsubscribeComposer);
    this.bot.use(startComposer);
    this.bot.use(helpComposer);
    this.bot.use(timeTableComposer);
    this.bot.use(downloadComposer);
    // this.bot.use(getPairsComposer);
    // this.bot.use(getPairsByLectorComposer);

    this.bot.catch((err) => {
      //TODO: Add check of error types
      error(err);
    });
  }

  async init() {
    this.bot.start();
  }
}

export default new TelegramService();
