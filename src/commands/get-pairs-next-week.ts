import { Subscriber } from "../db/entities/Subscriber";
import dayjs from "dayjs";
import repository from "../db/repository";
import { formatPairs } from "../commons/formatPairs";

export const getPairsForNextWeekCommand = async (
    sub: Subscriber,
    findFilter?: string
  ) => {
    let filter = sub ? sub.subscribedGroup ?? sub.subscribedLector : "";
    if (findFilter) {
      filter = findFilter;
    }
  
    const weekStart = dayjs().startOf("week").add(1, "week");
    const weekEnd = weekStart.clone().endOf("week");
  
    const pairs = await repository.findPairs(
      filter,
      weekStart.toDate(),
      weekEnd.toDate()
    );
  
    return { success: true, messages: formatPairs(pairs) };
  };