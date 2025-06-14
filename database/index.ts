import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as fs from "fs";
import * as path from "path";

export async function initDb() {
  const db = await open({
    filename: path.join(__dirname, "awoo.db"),
    driver: sqlite3.Database,
  });

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await db.exec(schema);

  return db;
}
