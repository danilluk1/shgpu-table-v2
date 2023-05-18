import { Subscriber } from "../entities/Subscriber";
import { AppDataSource } from "./../db/index";

const subsRepository = AppDataSource.getRepository(Subscriber);
const groupsRepository = AppDataSource.getRepository(Group);

export const subscribeCommand = async ({
  sub,
  groupName
}: {
  sub?: Subscriber;
  groupName: string;
}) => {
  try {
    if (sub) {
      return {
        success: false,
        message: "Вы уже подписаны на одну из групп, сначала отпишитесь."
      };
    }

    groupName = groupName.replace(/\s/g, "").toLowerCase().trim();
    const group = await groupsRepository.findOneBy({
      name: groupName
    });
    if (!group) {
      return {
        success: false,
        message: "Не удалось найти группу с таким названием!"
      };
    }

    const newSubscriber = new Subscriber();
    newSubscriber.chatId = sub.chatId;
    newSubscriber.subscribedGroup = groupName;

    await subsRepository.save(newSubscriber);

    return {
      success: true,
      message: `Теперь вы подписаны на группу ${groupName}`
    };
  } catch (e) {
    return {
      success: false,
      message: "Внутренняя ошибка сервера. Повторите попытку позже."
    };
  }
};
