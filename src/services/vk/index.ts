import { Services } from "../../db/entities/Subscriber";
import { SendMessageOpts, ServiceInterface } from "../_interface";
import { VK as VKIO, MessageContext, Keyboard } from "vk-io";
import { HearManager } from "@vk-io/hear";
import { chatIn, error, info, warning } from "../../libs/logger";
import { chunk } from "lodash";
import repository from "../../db/repository";
import { command } from "../../decorators/command";
import { startVKCommand } from "../../commands/startVK";

class VK extends ServiceInterface {
  bot: VKIO;
  hearManager: HearManager<MessageContext>;

  constructor() {
    super({
      service: Services.VK
    });
  }

  async init() {
    const token = process.env.VK_GROUP_TOKEN;
    if (!token) {
      warning("VK: group token not setuped, library will not works.");
      return;
    }

    try {
      this.bot = new VKIO({ token });
      this.hearManager = new HearManager<MessageContext>();

      this.bot.updates.on("message", async (ctx, next) => {
        if (!ctx.isUser) return;
        if (ctx.text) chatIn(`VK [${ctx.peerId}]: ${ctx.text}`);

        await this.ensureUser(ctx);
        await this.listener(ctx);

        next();
      });
      this.bot.updates.on("messge_new", this.hearManager.middleware);

      await this.bot.updates.start();
      info("VK Service initialized.");
      this.inited = true;
    } catch (e) {
      error(e);
    }
  }

  async ensureUser(ctx: MessageContext) {
    const sub = await repository.getVkSubscriber(ctx.senderId.toString());
    ctx.sub = sub;
  }

  async listener(msg: MessageContext) {
    if (!msg.hasText) return;
    const commandName = msg.text;

    const command = this.commands.find((c) => c.name === commandName);
    if (!command) {
      await this["notFound"](msg);
      return;
    }

    await this[command.fnc](msg);
    return true;
  }

  @command("/start", { description: "Начать пользоваться ботом" })
  async start(ctx: MessageContext) {
    const { message, kb } = startVKCommand();

    ctx.send({
      message: message,
      keyboard: kb
    });
  }

  async sendMessage(opts: SendMessageOpts) {
    const targets = Array.isArray(opts.target) ? opts.target : [opts.target];
    const chunks = chunk(
      targets.map((t) => Number(t)),
      100
    );
    const attachment = opts.image
      ? await this.uploadPhoto(opts.image)
      : undefined;
    for (const chunk of chunks) {
      await this.bot.api.messages.send({
        random_id: Math.random() * (1000000000 - 9) + 10,
        user_ids: chunk,
        message: opts.message,
        dont_parse_links: true,
        attachment
      });
    }
  }

  async uploadPhoto(source: string) {
    return await this.bot.upload.messagePhoto({
      source: {
        value: source
      }
    });
  }
}

export default new VK();
