import { Subscriber } from "../db/entities/Subscriber";
import repository from "../db/repository";
import { formatPairs } from "../commons/formatPairs";
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { ru } from "date-fns/locale";

export const getPairsForNextWeekCommand = async (
  sub: Subscriber,
  findFilter?: string,
) => {
  let filter = sub ? sub.subscribedGroup ?? sub.subscribedLector : "";
  if (findFilter) {
    filter = findFilter;
  }

  const currentDate = new Date();
  const nextWeekStart = startOfWeek(addWeeks(currentDate, 1), {
    weekStartsOn: 1,
    locale: ru,
  });
  const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1, locale: ru });

  const pairs = await repository.findPairs(filter, nextWeekStart, nextWeekEnd);

  return { success: true, messages: formatPairs(pairs) };
};
