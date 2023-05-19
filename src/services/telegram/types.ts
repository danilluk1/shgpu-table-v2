import { Context as GrammyContext, SessionFlavor } from "grammy";
import { Subscriber } from "../../db/entities/Subscriber";

interface SessionData {
  sub: Subscriber | null;
}

export type Context = GrammyContext & SessionFlavor<SessionData>;
