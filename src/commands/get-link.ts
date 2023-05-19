import { faculties } from "../constants/faculties";
import { Subscriber } from "../db/entities/Subscriber";

export const getLinkCommand = (sub: Subscriber) => {
  if (!sub) {
    return {
      success: false,
      message: "Сначала подпишитесь на одну из групп!",
    };
  }

  if (!sub.facultyId) {
    return {
      success: false,
      message: "Не удалось найти информацию о вашем факультете!",
    };
  }

  const faculty = faculties.find((f) => f.id == sub.facultyId);
  if (!faculty) {
    return {
      success: false,
      message: "Не удалось найти ваш факультет. Внутренняя ошибка.",
    };
  }
  return {
    success: true,
    message: faculty.link,
  };
};
