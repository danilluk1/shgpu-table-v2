import dayjs from "dayjs";
import fs from "fs";
import { createStream } from "rotating-file-stream";
import { inspect } from "util";
import os from "os";
import { getFuncNameFromStackTrace } from "../commons/stacktrace";
import stripAnsi = require("strip-ansi");

const levelFormat = {
  error: "!!! ERROR !!!",
  chatIn: "<<<",
  chatOut: ">>>",
  info: "!!!",
  warning: "WARNING"
};

const logDir = "./logs";

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const file = createStream("./logs/bot.log", {
  maxFiles: 10,
  size: "512M",
  compress: "gzip"
});

const format = (level: string, message: any, category?: string) => {
  const timestamp = dayjs().format("YYYY-MM-DD[T]HH:mm:ss.SSS");

  if (typeof message === "object") {
    message = inspect(message);
  }

  return [timestamp, levelFormat[level], category, message]
    .filter(Boolean)
    .join(" ");
};

const log = (message: any) => {
  const level = getFuncNameFromStackTrace();

  const formattedMessage = format(level, message);
  process.stdout.write(formattedMessage + "\n");
  file.write(stripAnsi(formattedMessage) + os.EOL);
};

export const error = (message: any) => {
  log(message);
};

export const chatIn = (message: any) => {
  log(message);
};

export const chatOut = (message: any) => {
  log(message);
};

export const info = (message: any) => {
  log(message);
};

export const warning = (message: any) => {
  log(message);
};
