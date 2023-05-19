import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1684468634210 implements MigrationInterface {
  name = "Initial1684468634210";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "faculties" ("id" integer NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_fd83e4a09c7182ccf7bdb3770b9" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "groups" ("name" character varying NOT NULL, "facultyId" integer, CONSTRAINT "PK_664ea405ae2a10c264d582ee563" PRIMARY KEY ("name"))`);
    await queryRunner.query(`CREATE TABLE "pairs" ("id" text NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "number" integer NOT NULL, "day" integer NOT NULL, "group_name" text NOT NULL, "date" date NOT NULL, "facultyId" integer, CONSTRAINT "CHK_1cd5ce473d15e5eb33a9a9000f" CHECK ("day" >= 1 AND "day" <= 6), CONSTRAINT "CHK_a6c497329fc09bb8340e00f665" CHECK ("number" >= 1 AND "number" <= 6), CONSTRAINT "PK_bfc550b07b52c37db12aa7d8e69" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "lectors" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_87eda9bf8c85d84a6b18dfc4991" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "subscribers" ("id" SERIAL NOT NULL, "chatId" character varying NOT NULL, "service" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "subscribedGroup" character varying, "subscribedLector" character varying, "facultyId" integer NOT NULL, "subscribedToNotifications" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_45f6f1272318fbec4ac6daafa31" UNIQUE ("chatId", "service"), CONSTRAINT "PK_cbe0a7a9256c826f403c0236b67" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_c124116b108b19002472d893f34" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "pairs" ADD CONSTRAINT "FK_3bb84564de9abd02b63524a47d5" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pairs" DROP CONSTRAINT "FK_3bb84564de9abd02b63524a47d5"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_c124116b108b19002472d893f34"`);
    await queryRunner.query(`DROP TABLE "subscribers"`);
    await queryRunner.query(`DROP TABLE "lectors"`);
    await queryRunner.query(`DROP TABLE "pairs"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "faculties"`);
  }

}
