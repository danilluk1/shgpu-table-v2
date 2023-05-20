import { ParserBaseError } from "./parser-base.error";

export class WrongLinkProvidedError extends ParserBaseError {
  constructor(link: string) {
    super(`Error, wrong link ${link} provided`);
  }
}
