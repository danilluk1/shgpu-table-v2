import { Services, Subscriber } from "../entities/Subscriber";
import { In } from "typeorm";
import AppDataSource from "./db/index";
export interface SendMessageOpts {
  target: string | string[] | number | number[];
  image?: string;
  message: string;
}

export const services: ServiceInterface[] = [];

export class ServiceInterface {
  inited = false;
  service!: Services;

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
      await repository.find({
        id: In(targets.map((t) => t.toString()))
      })
    ).map((c) => c.id);
    this.sendMessage({ target: chats, ...opts });
  }
}
