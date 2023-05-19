import axios from "axios";

export const downloadPage = async (link: string): Promise<string> => {
  return (await axios.get(link)).data;
};
