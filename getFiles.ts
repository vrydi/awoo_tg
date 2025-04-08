import * as fs from "fs";

export const getFiles = (dir: string, suffix: string = "js") => {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  });
  let commandFiles: Array<string> = [];

  for (const file of files) {
    if (file.isDirectory()) {
      commandFiles = [
        ...commandFiles,
        ...getFiles(`${dir}/${file.name}`, suffix),
      ];
    } else if (file.name.endsWith(suffix)) {
      commandFiles.push(`${dir}/${file.name}`);
    }
  }
  return commandFiles;
};
