import { BaseParser } from "../parser/base-parser";
import { ItienParser } from "../parser/itien-parser";
import { PsychoParser } from "../parser/psycho-parser";

export const createParserByFaculty = (facultyId: number): BaseParser | null => {
  switch (facultyId) {
    // case 12:
    //   return new GymParser(path);
    case 8:
      return new PsychoParser();
    case 11:
      return new ItienParser();
    // case 3:
    //   return new PeParser(path);
    // case 15:
    //   return new CollegeParser(path);
    default:
      throw new Error("Unknown facultty error");
  }
};
