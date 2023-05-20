import XLSX, { Sheet } from "xlsx";
import * as fs from "fs";
import { FacultyId, TableInfo } from "../typings";
import axios from "axios";
import { TableDownloadError } from "./errors/table-download.error";

export abstract class BaseParser {
  protected id: FacultyId;
  protected facultyStoragePath: string;

  protected constructor(facultyId: FacultyId) {
    this.id = facultyId;
    this.facultyStoragePath = `${process.env.STORAGE_PATH}/${this.id}`;
  }

  protected async getTableModifyDate(pathTo: string): Promise<Date | null> {
    try {
      const wb = XLSX.readFile(pathTo);
      return wb.Props?.ModifiedDate;
    } catch (e) {
      return null;
    }
  }

  protected async downloadTable(link: string): Promise<void> {
    const tableName = link.split("/").pop();
    try {
      const { data } = await axios.get(link, { responseType: "arraybuffer" });
      if (!fs.existsSync(this.facultyStoragePath)) {
        fs.mkdirSync(this.facultyStoragePath, {
          recursive: true,
        });
      }
      fs.writeFileSync(`${this.facultyStoragePath}/${tableName}`, data);
    } catch (e) {
      throw new TableDownloadError(e);
    }
  }

  protected createNewTableInfo(
    isNew: boolean,
    isModified: boolean,
    beginDate: Date,
    endDate: Date,
    link: string,
  ): TableInfo {
    return {
      facultyId: this.id,
      isNew: isNew,
      isModified: isModified,
      weekBegin: beginDate,
      weekEnd: endDate,
      link: link,
    };
  }

  protected abstract getGroupColumn(groupName: string, sheet: Sheet): number;

  public abstract processTable(linkTo: string): Promise<TableInfo>;
}
