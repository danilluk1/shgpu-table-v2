import { NextFunction } from "grammy";
import { Services, Subscriber } from "../../../db/entities/Subscriber";
import { Context } from "../types";
import { AppDataSource } from "../../../db";

export const addSubscriberMiddleware = async (
  ctx: Context,
  next: NextFunction
) => {
  if (!ctx.from?.id) return;
  const repository = AppDataSource.getRepository(Subscriber);

  const sub = await repository.findOneBy({
    chatId: String(ctx.from?.id),
    service: Services.TELEGRAM,
  });

  ctx.session.sub = sub ?? null;
  return await next();
};
