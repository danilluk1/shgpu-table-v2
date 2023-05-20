import XLSX, { WorkBook } from "xlsx";
import * as fs from "fs";
import { FacultyId } from "../typings";

export const getLocalCopyModifyDate = async (
  tableName: string,
  facultyId: FacultyId,
) => {
  const path = `${process.env.STORAGE_PATH}${facultyId}/${tableName}`;
  if (fs.existsSync(path)) {
    const workbook: WorkBook = XLSX.readFile(path);
    if (!workbook.Props) return null;
    return workbook.Props.ModifiedDate;
  } else {
    return null;
  }
};
