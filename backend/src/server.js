import https from "https";
import fs from "fs";
import app from "./app.js";

const PORT = 3001;

const httpsOptions = {
  key: fs.readFileSync("./certs/key.pem"),
  cert: fs.readFileSync("./certs/cert.pem")
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`🔐 HTTPS Server running on https://localhost:${PORT}`);
});
