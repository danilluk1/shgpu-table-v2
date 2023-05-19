import * as fs from "fs";
import XLSX, { Sheet, WorkBook } from "xlsx";
import { TableInfo, Week, FacultyId } from "./../typings/index";
import { error } from "../libs/logger";

export abstract class Parser {
  protected id: FacultyId;
  protected path: string;
  protected sheet: Sheet;

  protected constructor(facultyId: FacultyId) {
    this.id = facultyId;
  }

  public async getTableModifyDate(
    tableName: string,
    facultyId: number
  ): Promise<Date> {
    try {
      const path = `${process.env.STORAGE_PATH}/${facultyId}/${tableName}`;
      if (fs.existsSync(path)) {
        const workbook: WorkBook = XLSX.readFile(path);
        if (!workbook.Props?.ModifiedDate) {
          throw new Error("Can't read XLSX");
        }

        return workbook.Props.ModifiedDate;
      }
    } catch (err) {
      error(err);
    }
  }

  protected getGroupColumn(
    groupName: string,
    sheet: Sheet,
    path: string
  ): number {
    throw new Error("unimplemented getGroupColumn");
  }

  public async processTable(tableLink: string): Promise<TableInfo> {
    throw new Error("unimplemented processTable");
  }
}
