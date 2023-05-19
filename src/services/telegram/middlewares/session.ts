import { session } from "grammy";

export const sessionMiddleware = session({
  // eslint-disable-next-line
  getSessionKey: (ctx) => (ctx.from?.id ?? ctx.chat?.id).toString(),
  initial: () => ({
    sub: null,
  }),
});
