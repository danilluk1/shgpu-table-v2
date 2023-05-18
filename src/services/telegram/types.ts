import { Context as GrammyContext, SessionFlavor } from "grammy";
import { Subscriber } from "../../entities/Subscriber";

interface SessionData {
  sub: Subscriber;
}

export type Context = GrammyContext & SessionFlavor<SessionData>;
