import { Subscriber } from "../db/entities/Subscriber";
import dayjs from "dayjs";
import repository from "../db/repository";
import { formatPairs } from "../commons/formatPairs";

export const getPairsForTomorrowCommand = async (
  sub: Subscriber,
  findFilter?: string
) => {
  let filter = sub ? sub.subscribedGroup ?? sub.subscribedLector : "";
  if (findFilter) {
    filter = findFilter;
  }

  const tomorrowStart = dayjs().startOf("day").add(1,"day");
  const tomorrowEnd = tomorrowStart.clone().endOf("day");

  const today = dayjs(); 

  const sundayCheck = today.add(1, "day");
  if (sundayCheck.day() === 0){
    return { success: true, messages: ["Завтра воскресенье, пар нет"] };
  }
    
  const pairs = await repository.findPairs(
    filter,
    tomorrowStart.toDate(),
    tomorrowEnd.toDate()
  );
  
  return { success: true, messages: formatPairs(pairs) };
};

