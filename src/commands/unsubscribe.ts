import { Subscriber } from "../entities/Subscriber";
import { AppDataSource } from "./../db/index";

const subsRepository = AppDataSource.getRepository(Subscriber);

export const unsubscribeCommand = async ({ sub }: { sub?: Subscriber }) => {
  try {
    if (!sub) {
      return {
        success: false,
        message: "Вы ещё не подписаны на обновления."
      };
    }

    await subsRepository.delete(sub.id);
    return {
      success: true,
      message: "Вы успешно отписались от обновлений."
    };
  } catch (e) {
    return {
      success: false,
      message: "Внутренняя ошибка сервера. Повторите попытку позже."
    };
  }
};
