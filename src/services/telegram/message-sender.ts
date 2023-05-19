import { chatOut, error } from "../../libs/logger";
import { SendMessageOpts } from "../_interface";
import TelegramService from "./index";

export class TelegramMessageSender {
  static async sendMessage(opts: SendMessageOpts) {
    const targets = Array.isArray(opts.target) ? opts.target : [opts.target];
    for (const target of targets) {
      const log = () =>
        chatOut(
          `TG [${target}]: ${opts.message}`.replace(/(\r\n|\n|\r)/gm, " "),
        );
      if (opts.image) {
        await TelegramService.bot.api
          .sendPhoto(target, opts.image, {
            caption: opts.message,
            parse_mode: "HTML",
          })
          .then(() => log())
          .catch((e) => this.catchError(e, target));
      } else if (opts.kb) {
        await TelegramService.bot.api.sendMessage(target, opts.message, {
          reply_markup: opts.kb,
          disable_web_page_preview: true,
          parse_mode: "HTML",
        });
      } else {
        await TelegramService.bot.api.sendMessage(target, opts.message, {
          disable_web_page_preview: true,
          parse_mode: "HTML",
        });
      }
    }
  }

  private static async catchError(e: unknown) {
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
