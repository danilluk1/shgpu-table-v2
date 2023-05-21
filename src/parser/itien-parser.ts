import XLSX, { Sheet } from "xlsx";
import { getTableWeekFromName } from "../commons/getTableWeekFromName";
import {
  fridayPairs,
  mondayPairs,
  saturdayPairs,
  thursdayPairs,
  tuesdayPairs,
  wednesdayPairs,
} from "./../constants/itienTable";
import { FacultyId, TableInfo, Week } from "../typings";
import { BaseParser } from "./base-parser";
import { WrongLinkProvidedError } from "./errors/wrong-link-provided.error";
import { TableParsingError } from "./errors/table-parsing.error";
import { itienGroups } from "../constants/groups";
import { addDays } from "date-fns";
import repository from "../db/repository";
import { getPairAndDayByRow } from "../commons/getPairAndDayByRow";

export class ItienParser extends BaseParser {
  constructor() {
    super(FacultyId.ITIEN);
  }

  public async processTable(linkTo: string): Promise<TableInfo> {
    const tableName = linkTo.split("/").pop();
    if (!tableName) {
      throw new WrongLinkProvidedError(linkTo);
    }

    const tablePath = `${this.facultyStoragePath}/${tableName}`;

    const localTableModifyDate = await this.getTableModifyDate(tablePath);

    await this.downloadTable(linkTo);
    const downloadedTableModifyDate = await this.getTableModifyDate(tablePath);
    const tableWeek = getTableWeekFromName(tableName);
    /*
      If we have copy of downloaded table locally, and table wasn't updated.
     */
    if (
      localTableModifyDate !== null &&
      localTableModifyDate === downloadedTableModifyDate
    ) {
      await this.normalizeTable(tablePath);
      return this.createNewTableInfo(
        false,
        false,
        tableWeek.beginDate,
        tableWeek.endDate,
        linkTo,
      );
    } else if (
      /*
      If we have copy of downloaded table locally, and table was updated
     */
      localTableModifyDate !== null &&
      localTableModifyDate !== downloadedTableModifyDate
    ) {
      await this.normalizeTable(tablePath);
      return this.createNewTableInfo(
        false,
        true,
        tableWeek.beginDate,
        tableWeek.endDate,
        linkTo,
      );
    } else {
      await this.normalizeTable(tablePath);
      return this.createNewTableInfo(
        true,
        false,
        tableWeek.beginDate,
        tableWeek.endDate,
        linkTo,
      );
    }
  }

  private async normalizeTable(pathTo: string) {
    const tableName = pathTo.split("/").pop();
    const tableWeek = getTableWeekFromName(tableName);

    const wb = XLSX.readFile(pathTo);
    const sheet = wb.Sheets[wb.SheetNames[0] as string];
    if (!sheet) {
      throw new TableParsingError(`Cannot open sheet for this ${pathTo}`);
    }

    for (const group of itienGroups) {
      await this.normalizeTableForGroup(tableWeek, group, sheet);
    }
  }

  private async normalizeTableForGroup(
    tableWeek: Week,
    groupName: string,
    sheet: Sheet,
  ) {
    const range = XLSX.utils.decode_range(sheet["!ref"] as string);
    const groupColumn = this.getGroupColumn(groupName, sheet);
    const mergesRanges = sheet["!merges"];

    let cell = "";
    for (let r = range.s.r; r <= range.e.r; r++) {
      cell = XLSX.utils.encode_cell({
        c: groupColumn,
        r: r,
      });
      if (sheet[cell]) {
        const pair = getPairAndDayByRow(
          r,
          mondayPairs,
          tuesdayPairs,
          wednesdayPairs,
          thursdayPairs,
          fridayPairs,
          saturdayPairs,
        );
        if (pair) {
          pair.name = sheet[cell].w;
          const tempCell = XLSX.utils.encode_cell({
            c: groupColumn,
            r: r - 1,
          });
          if (sheet[tempCell]) {
            pair.name += ` ${sheet[tempCell].w}`;
            pair.date = addDays(
              tableWeek.beginDate,
              pair.day - 1,
            ).toISOString();
            pair.faculty = {
              id: this.id,
              name: "Институт информационных технологий,точных и естественных наук",
            };
            pair.groupName = groupName;
            try {
              await repository.addPair(pair);
            } catch (e) {
              throw new TableParsingError(
                "Failed to add pairs, so parser might be broken.",
                e,
              );
            }
          }
        }
      } else {
        for (const merged of mergesRanges) {
          if (
            groupColumn >= merged.s.c &&
            groupColumn <= merged.e.c &&
            merged.s.r === r
          ) {
            const cell = XLSX.utils.encode_cell({
              c: merged.s.c,
              r: merged.s.r,
            });
            if (!sheet[cell]) continue;
            const pair = getPairAndDayByRow(
              merged.s.r,
              mondayPairs,
              tuesdayPairs,
              wednesdayPairs,
              thursdayPairs,
              fridayPairs,
              saturdayPairs,
            );
            if (pair) {
              pair.name = sheet[cell].w;
              const tempCell = XLSX.utils.encode_cell({
                c: merged.s.c,
                r: merged.s.r - 1,
              });
              if (sheet[tempCell]) {
                pair.name += ` ${sheet[tempCell].w}`;
                pair.date = addDays(
                  tableWeek.beginDate,
                  pair.day - 1,
                ).toISOString();
                pair.faculty = {
                  id: this.id,
                  name: "Институт информационных технологий,точных и естественных наук",
                };
                pair.groupName = groupName;
                try {
                  await repository.addPair(pair);
                } catch (e) {
                  throw new TableParsingError(
                    "Failed to add pairs, so parser might be broken.",
                    e,
                  );
                }
              }
            }
            break;
          }
        }
      }
    }
  }

  protected getGroupColumn(groupName: string, sheet: Sheet): number {
    const range = XLSX.utils.decode_range(sheet["!ref"] as string);

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = XLSX.utils.encode_cell({ c: c, r: r });
        if (!sheet[cell]) continue;
        if (typeof sheet[cell].v !== "string") continue;
        if (sheet[cell].v.toLowerCase() === groupName.toLowerCase()) {
          return c;
        }
      }
    }

    return -1;
  }
}
