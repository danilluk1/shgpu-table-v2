import { ItienParser } from "../parser/itienParser.js";
import { Parser } from "../parser/parser.js";

export const createParserByFaculty = (facultyId: number): Parser | null => {
  switch (facultyId) {
    // case 12:
    //   return new GymParser(path);
    // case 8:
    //   return new PsychoParser(path);
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
