import { describe, test } from "vitest";
import { ItienParser } from "../../itienParser";

describe("Situations, which can happens with parser", async () => {
  test("Parse default table without getting any error", async () => {
    const parser = new ItienParser();

    const validLink =
      "https://shgpi.edu.ru/fileadmin/rasp/faculty/f11/22_05_2023_28_05_2023/22_05_2023_28_05_2023.xls";
    await parser.processTable(validLink);
  });
});
