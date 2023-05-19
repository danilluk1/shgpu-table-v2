import { session } from "grammy";

export const sessionMiddleware = session({
  getSessionKey: (ctx) => (ctx.from?.id ?? ctx.chat?.id).toString(),
  initial: () => ({
    sub: null,
  }),
});
