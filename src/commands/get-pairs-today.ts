import { Subscriber } from "../db/entities/Subscriber";
import dayjs from "dayjs";
import repository from "../db/repository";
import { formatPairs } from "../commons/formatPairs";

export const getPairsForTodayCommand = async (
  sub: Subscriber,
  findFilter?: string,
) => {
  let filter = sub ? sub.subscribedGroup ?? sub.subscribedLector : "";
  if (findFilter) {
    filter = findFilter;
  }

  const todayStart = dayjs().startOf("day");
  const todayEnd = todayStart.clone().endOf("day");

  const pairs = await repository.findPairs(
    filter,
    todayStart.toDate(),
    todayEnd.toDate(),
  );

  return { success: true, messages: formatPairs(pairs) };
};
