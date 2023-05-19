import "dotenv/config";
import "reflect-metadata";
// import "source-map-support/register";
import cron from "node-cron";
import repository from "./db/repository";
import telegramService from "./services/telegram";
import { error } from "./libs/logger";

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
    //   link: "https://shgpi.edu.ru/struktura-universiteta/f03/raspisanie/raspisanie-ochnogo-otdelenija-ffk/",
    // },
    // {
    //   id: 15,
    //   name: "Университетский колледж",
    //   link: "https://shgpi.edu.ru/struktura-universiteta/f15/raspisanie/ochnaja-forma-obuchenija/",
    // },
  ];

/*
  Get new table for all supported faculties and send message to their subscribers.
 */
cron.schedule("*/2 * * * *", async () => {
  for (const faculty of supportedFaculties) {
    // const page: string = await
    // parser = createParserByFaculty(faculty.id);
    // parser.parseTable(faculty.linkToTables);
  }
});

/*
  Send notification to subscribers at 7 am every day.
*/
cron.schedule("0 7 * * *", async () => {});

/*
  Send notification to subscribers at 7 pm every day.
*/
cron.schedule("0 19 * * *", async () => {});

const start = async () => {
  try {
    await repository.connect();
    await telegramService.init();
  } catch (e) {
    error(e);
  }
  console.log("Bot has been started.");
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
