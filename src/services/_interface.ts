import { Keyboard } from "grammy";
import { AppDataSource } from "../db";
import { Services, Subscriber } from "../db/entities/Subscriber";
import { In } from "typeorm";
import { CommandDecoratorOptions } from "../decorators/command";
export interface SendMessageOpts {
  target: string | string[] | number | number[];
  image?: string;
  message: string;
  kb?: Keyboard;
}

export const services: ServiceInterface[] = [];

export class ServiceInterface {
  inited = false;
  service!: Services;
  commands: Array<{ name: string; fnc: string } & CommandDecoratorOptions>;

  constructor({ service }: { service: Services }) {
    services.push(this);
    this.service = service;
  }

  protected init(): void {
    throw new Error("Method init not implemented");
  }

  sendMessage(opts: SendMessageOpts): Promise<any> {
    throw new Error("Method sendMessage not implemented");
  }

  async makeAnnounce(opts: SendMessageOpts) {
    if (!this.inited) return;
    const targets = Array.isArray(opts.target) ? opts.target : [opts.target];
    const repository = AppDataSource.getRepository(Subscriber);
    const chats = (
      await repository.findBy({
        id: In(targets.map((t) => t.toString()))
      })
    ).map((c) => c.id);
    this.sendMessage({ target: chats, ...opts });
  }
}
