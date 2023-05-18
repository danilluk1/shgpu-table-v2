import { parse } from "path";

export const getFuncNameFromStackTrace = () => {
  const _preparedStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_s, s) => s;
  const stack = new Error().stack as unknown as NodeJS.CallSite[];
  Error.prepareStackTrace = _preparedStackTrace;
  const path = parse(stack[2].getFunctionName() || "");

  return path.name;
};
