import { MigrationInterface, QueryRunner } from "typeorm";

export class PairsUniqueConstraint1684640810270 implements MigrationInterface {
  name = "PairsUniqueConstraint1684640810270";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pairs" ADD CONSTRAINT "UQ_4b319b6f6da5102b9e6c570900d" UNIQUE ("name", "number", "day", "group_name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pairs" DROP CONSTRAINT "UQ_4b319b6f6da5102b9e6c570900d"`);
  }

}
