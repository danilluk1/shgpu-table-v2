import { ParserBaseError } from "./parser-base.error";

export class TableDownloadError extends ParserBaseError {
  public caused: Error;

  constructor(caused: Error) {
    super("Error, while downloading table. See caused field.");
    this.caused = caused;
  }
}
