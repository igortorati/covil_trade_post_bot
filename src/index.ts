import { config } from "./config/config";
import { start } from "./initDatabase";
import { client } from "./setupEvents";

client.login(config.discord.token);
start();