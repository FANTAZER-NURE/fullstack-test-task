import "dotenv/config";
import { createApp } from "./app";
import { config } from "./config";
import { initDb } from "./db";

async function main() {
  await initDb();
  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on :${config.port}`);
  });
}

main().catch((err) => {
   
  console.error("Fatal startup error", err);
  process.exit(1);
});
