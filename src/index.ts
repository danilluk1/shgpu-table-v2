import "dotenv/config";
import "reflect-metadata";
import "source-map-support/register";
import cron from "node-cron";
import repository from "./db/repository";
import telegramService from "./services/telegram";
import { error, info } from "./libs/logger";
import { downloadPage } from "./commons/download-page";
import { getTopTablesLinks } from "./commons/get-top-tables-links";
import { createParserByFaculty } from "./commons/createParserByFaculty";
import { TelegramMessageSender } from "./services/telegram/message-sender";
import vk from "./services/vk";
import { Services } from "./db/entities/Subscriber";
import { WrongLinkProvidedError } from "./parser/errors/wrong-link-provided.error";
import { TableDownloadError } from "./parser/errors/table-download.error";
import { AxiosError } from "axios";
import { WrongTableNameError } from "./parser/errors/wrong-table-name.error";
import { TableParsingError } from "./parser/errors/table-parsing.error";

export const supportedFaculties: { id: number; name: string; link: string }[] =
  [
    // {
    //   id: 12,
    //   name: "Гуманитарный институт",
    //   link: "https://shgpi.edu.ru/struktura-universiteta/f12/raspisanie/raspisanie-ochnogo-otdelenija/",
    // },
    // {
    //   id: 8,
    //   name: "Институт психологии и педагогики",
    //   link: "https://shgpi.edu.ru/struktura-universiteta/f08/raspisanie/raspisanie-ochnogo-otdelenie-fpo/",
    // },
    {
      id: 11,
      name: "Институт информационных технологий,точных и естественных наук",
      link: "https://shgpi.edu.ru/struktura-universiteta/f11/raspisanie/raspisanie-uchebnykh-zanjatii-ochnaja-forma-obuchenija/",
    },
    // {
    //   id: 3,
    //   name: "Факультет физической культуры",
    //   link: "https://shgpiedu.ru/struktura-universiteta/f03/raspisanie/raspisanie-ochnogo-otdelenija-ffk/",
    // },
    // {
    //   id: 15,
    //   name: "Университетский колледж",
    //   link: "https://shgpi.edu.ru/struktura-universiteta/f15/raspisanie/ochnaja-forma-obuchenija/",
    // },
  ];

const checkTableForChangesAndBroadcast = async () => {
  try {
    for (const faculty of supportedFaculties) {
      info(`Начинаю парсить данные для ${faculty.name}`);
      const page: string = await downloadPage(faculty.link);
      const links: string[] = getTopTablesLinks(page, 3);
      for (const link of links) {
        const parser = createParserByFaculty(faculty.id);
        let res = null;
        try {
          res = await parser.processTable(link);
          if (res.isNew && res.isModified) {
            throw new Error("Error with parser during processing.");
          }
          let message = "";
          const curTime = new Date();
          if (res.isNew) {
            if (curTime > res.weekBegin && curTime < res.weekEnd) {
              message = `Появилось расписание на текущую неделю, вы можете получить расписание по ссылке ${res.link} или введя команду: пары на неделю`;
            } else if (curTime < res.weekBegin) {
              message = `Появилось расписание на следущую неделю, вы можете получить расписание по ссылке ${res.link} или введя команду: пары на след неделю`;
            }
          }

          if (res.isModified) {
            if (curTime > res.weekBegin && curTime < res.weekEnd) {
              message = `Обновилось расписание на текущую неделю, вы можете получить расписание по ссылке ${link} или введя команду: пары на неделю`;
            } else if (curTime < res.weekBegin) {
              message = `Обновилось расписание на следущую неделю, вы можете получить расписание по ссылке ${link} или введя команду: пары на след неделю`;
            }
          }

          if (message == "") return;

          try {
            const subs = await repository.getSubscribers(faculty.id);
            for (const sub of subs) {
              if (sub.subscribedToNotifications) {
                if (sub.service === Services.TELEGRAM) {
                  await TelegramMessageSender.sendMessage({
                    target: sub.chatId,
                    message: message,
                  });
                } else {
                  await vk.sendMessage({
                    target: sub.chatId,
                    message: message,
                  });
                }
              }
            }
          } catch (err) {
            error(err);
          }
        } catch (err) {
          error(err);
          if (err instanceof WrongLinkProvidedError) {
            /*
              TODO: make announcement that bot is broken
             */
          } else if (err instanceof TableDownloadError) {
            const tdError = err as TableDownloadError;
            if (tdError?.caused instanceof AxiosError) {
              /*
                TODO: сделать обработку того, когда по какой-то причине не удалось скачать расписание
               */
            } else {
              /*
                TODO: сделать ошибку, когда не удалось скачать файл из-за внутренней ошибки в папке
               */
            }
          } else if (err instanceof WrongTableNameError) {
            /*
              TODO: make announcement that bot is broken
             */
          } else if (err instanceof TableParsingError) {
            /*
                TODO: сделать обработку того, что мы не смогли распарсить данные, тут поидее надо восстановить данные из бэкапа,
                только его надо сделать предварительно
            */
          }
        }
      }
      info(`Закончил парсить данные для ${faculty.name}`);
    }
  } catch (e) {
    error(e);
  }
};

/*
  Get new table for all supported faculties and send message to their subscribers.
 */
cron.schedule("0 */2 * * *", async () => {
  info(`Sheduler started at ${Date.now()}`);
  await checkTableForChangesAndBroadcast();
});

/*
  Send notification to subscribers at 7 am every day.
*/
cron.schedule("0 7 * * *", async () => {
  info(`Sheduler started at ${Date.now()}`);
});

/*
  Send notification to subscribers at 7 pm every day.
*/
cron.schedule("0 19 * * *", async () => {
  info(`Sheduler started at ${Date.now()}`);
});

const start = async () => {
  try {
    await repository.connect();
  } catch (e) {
    error(e);
    process.exit(1);
  }

  await telegramService.init();
  await vk.init();
  // eslint-disable-next-line
  await checkTableForChangesAndBroadcast();
};

start().catch(console.error);

process
  .on("SIGINT", async () => {
    await telegramService.bot.stop();
    process.exit(0);
  })
  .on("SIGTERM", async () => {
    await telegramService.bot.stop();
    process.exit(0);
  })
  .on("unhandledRejection", (reason) => {
    error(reason);
  })
  .on("uncaughtException", (err: Error) => {
    const date = new Date().toISOString();

    process.report?.writeReport(`uncaughtException-${date}`, err);
    error(err);

    process.exit(1);
  });

//npx typeorm-ts-node-esm migration:generate ./src/db/migrations/Initial -d ./src/db/index.ts
