import { GrammyError } from "grammy";
import { chatOut, error } from "../../libs/logger";
import { SendMessageOpts } from "../_interface";
import TelegramService from "./index";
import { Subscriber } from "../../db/entities/Subscriber";

export class TelegramMessageSender {
  static async sendMessage(opts: SendMessageOpts) {
    const targets = Array.isArray(opts.target) ? opts.target : [opts.target];
    for (const target of targets) {
      const log = () =>
        chatOut(
          `TG [${target}]: ${opts.message}`.replace(/(\r\n|\n|\r)/gm, " ")
        );
      if (opts.image) {
        TelegramService.bot.api
          .sendPhoto(target, opts.image, {
            caption: opts.message,
            parse_mode: "HTML"
          })
          .then(() => log())
          .catch((e) => this.catchError(e, target));
      }
    }
  }

  private static async catchError(e: unknown, chatId: string | number) {
    error(e);
    // if (e instanceof GrammyError) {
    //   if (e.error_code === 400 || e.error_code === 403) {
    //     const sub = await AppDataSource.getRepository(Subscriber).findOne({
    //       chatId: chatId.toString()
    //     });
    //     if (sub) await sub.remove();
    //   }
    // }
  }
}
