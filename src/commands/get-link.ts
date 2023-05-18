import { faculties } from "../constants/faculties";
import { Subscriber } from "../db/entities/Subscriber";

export const getLinkCommand = (sub: Subscriber) => {
  if (!sub) {
    return {
      success: false,
      message: "Сначала подпишитесь на одну из групп!"
    };
  }

  // faculties.find(f => f.id = sub.)
};
