import waitPort from "wait-port";
import { config } from "../config/config";

async function checkDatabase() {
  await waitPort({
    host: config.db.host,
    port: config.db.port,
    timeout: 60000,
  });
  console.log("MySQL is ready!");
}

checkDatabase();
