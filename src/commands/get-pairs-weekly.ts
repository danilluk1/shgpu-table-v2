import { Subscriber } from "../db/entities/Subscriber";
import dayjs from "dayjs";
import repository from "../db/repository";
import { formatPairs } from "../commons/formatPairs";
import { endOfWeek, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";

export const getPairsForWeekCommand = async (
  sub: Subscriber,
  findFilter?: string,
) => {
  let filter = sub ? sub.subscribedGroup ?? sub.subscribedLector : "";
  if (findFilter) {
    filter = findFilter;
  }

  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: 1,
    locale: ru,
  });
  const weekEnd = endOfWeek(currentDate, {
    weekStartsOn: 1,
    locale: ru,
  });

  const pairs = await repository.findPairs(filter, weekStart, weekEnd);

  return { success: true, messages: formatPairs(pairs) };
};
