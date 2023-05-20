import { ParserBaseError } from "./parser-base.error";

export class TableParsingError extends ParserBaseError {
  public description?: string;
  public caused?: Error;
  constructor(description?: string, casued?: Error) {
    super(`Error while parsing table, description: ${description}`);
    this.description = description;
    this.caused = casued;
  }
}
