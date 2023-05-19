import { error } from "console";
import { Services, Subscriber } from "../db/entities/Subscriber";
import { AppDataSource } from "./../db/index";
import repository from "../db/repository";

const subsRepository = AppDataSource.getRepository(Subscriber);

export const subscribeCommand = async ({
  sub,
  chatId,
  groupName,
}: {
  sub?: Subscriber;
  chatId: number;
  groupName: string;
}) => {
  try {
    if (sub) {
      return {
        success: false,
        message: "Вы уже подписаны на одну из групп, сначала отпишитесь.",
      };
    }

    const group = await repository.getGroup(groupName);
    if (!group) {
      return {
        success: false,
        message: "Не удалось найти группу с таким названием!",
      };
    }

    const newSubscriber = new Subscriber();
    newSubscriber.chatId = chatId.toString();
    newSubscriber.service = Services.TELEGRAM;
    newSubscriber.subscribedGroup = groupName;
    newSubscriber.facultyId = group.faculty.id;

    await subsRepository.save(newSubscriber);

    return {
      success: true,
      message: `Теперь вы подписаны на группу ${groupName}`,
    };
  } catch (e) {
    error(e);
    return {
      success: false,
      message: "Внутренняя ошибка сервера. Повторите попытку позже.",
    };
  }
};
