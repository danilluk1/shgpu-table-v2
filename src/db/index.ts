import { resolve } from "path";

import "reflect-metadata";
import { DataSource } from "typeorm";

import { Faculty } from "./entities/Faculty";
import { Group } from "./entities/Group";
import { Pair } from "./entities/Pair";
import { Lector } from "./entities/Lector";
import { Subscriber } from "./entities/Subscriber";

export * from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DB_CONN,
  entities: [Group, Pair, Faculty, Lector, Subscriber],
  migrations: ["src/db/migrations/*.ts"],
  migrationsTableName: "typeorm_migrations"
});
