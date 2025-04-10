export default function (req: any, res: any, next: any) {
  // Middleware function to check if the request is authenticated
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  if (token !== process.env.auth_password) {
    return res.status(403).send("Forbidden");
  }

  next();
}
