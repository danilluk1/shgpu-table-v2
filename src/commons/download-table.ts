import * as fs from "fs";
import axios from "axios";

export const downloadTable = async (link: string, faculty: any) => {
  const tableName = link.split("/").pop();
  const facultyPath = `${process.env.STORAGE_PATH}/${faculty.id}`;

  return axios.get(link, { responseType: "arraybuffer" }).then(({ data }) => {
    if (!fs.existsSync(facultyPath)) {
      fs.mkdirSync(facultyPath, {
        recursive: true
      });
    }
    fs.writeFileSync(facultyPath, data);

    return facultyPath;
  });
};
