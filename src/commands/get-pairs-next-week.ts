import { Subscriber } from "../db/entities/Subscriber";
import dayjs from "dayjs";
import repository from "../db/repository";

export const getPairsForNextWeekCommand = async (
  sub: Subscriber,
  findFilter?: string
) => {
  let filter = sub ? sub.subscribedGroup ?? sub.subscribedLector : "";
  if (findFilter) {
    filter = findFilter;
  }

  const weekStart = dayjs().startOf("week").add(7, "day");
  const weekEnd = weekStart.clone().add(6, "day");

  const pairs = await repository.findPairs(
    filter,
    weekStart.toDate(),
    weekEnd.toDate()
  );

  return pairs;
};
