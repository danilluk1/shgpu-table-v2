import { Lector } from "../db/entities/Lector";
import { Subscriber } from "../db/entities/Subscriber";
import { AppDataSource } from "./../db/index";

const subsRepository = AppDataSource.getRepository(Subscriber);
const lectorsRepository = AppDataSource.getRepository(Lector);

export const subscribeCommand = async ({
  sub,
  chatId,
  lectorName,
}: {
  sub?: Subscriber;
  chatId: number;
  lectorName: string;
}) => {
  try {
    if (sub) {
      return {
        success: false,
        message: "Вы уже подписаны, сначала отпишитесь.",
      };
    }

    lectorName = lectorName.replace(/\s/g, "").toLowerCase().trim();
    const lector = await lectorsRepository.findOneBy({
      name: lectorName,
    });
    if (!lector) {
      return {
        success: false,
        message: "Не удалось найти преподавателя!",
      };
    }

    const newSubscriber = new Subscriber();
    newSubscriber.chatId = chatId.toString();
    newSubscriber.subscribedLector = lectorName;

    await subsRepository.save(newSubscriber);

    return {
      success: true,
      message: `Теперь вы подписаны на преподавателя ${lectorName}`,
    };
  } catch (e) {
    return {
      success: false,
      message: "Внутренняя ошибка сервера. Повторите попытку позже.",
    };
  }
};
