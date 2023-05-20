export const downloadTable = async (link: string, faculty: any) => {
  const tableName = link.split("/").pop();

  return `./temp/${faculty}/${tableName}`;
};
