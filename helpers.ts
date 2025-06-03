export function getPassword(): string {
  const nowDate = new Date();
  const date =
    nowDate.getFullYear() +
    "-" +
    ("0" + (nowDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + nowDate.getDate()).slice(-2);

  const password = process.env.auth_password + date;

  const hash = require("crypto")
    .createHash("sha1")
    .update(password)
    .digest("hex");
  return hash;
}
