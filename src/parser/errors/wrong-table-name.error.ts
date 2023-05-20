import { ParserBaseError } from "./parser-base.error";

export class WrongTableNameError extends ParserBaseError {
  constructor(tableName: string) {
    super(`Wrong table name: ${tableName}`);
  }
}
