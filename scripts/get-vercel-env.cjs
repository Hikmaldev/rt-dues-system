const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL="([^"]+)"/);
if (match) {
  const url = match[1].replace("channel_binding=require&", "");
  console.log("DATABASE_URL untuk Vercel (copy ini):\n");
  console.log(url);
}
