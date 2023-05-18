import { NextFunction } from "grammy";
import { Services, Subscriber } from "../../../entities/Subscriber";
import { Context } from "../types";

export const addSubscriberMiddleware = async (
  ctx: Context,
  next: NextFunction
) => {
  if (!ctx.from?.id) return;
  const repository = AppDataSource.getRepository(Subscriber);

  const sub = await repository.findOne({
    chatId: String(ctx.from?.id),
    service: Services.TELEGRAM
  });

  ctx.session.sub = sub;
  return await next();
};
