import { config } from "./config/config";
import { start } from "./scripts/initDatabase";
import { client } from "./config/client";
import "./events/ready";
import "./events/guildCreate";
import "./events/interactionCreateIsAutocomplete";
import "./events/interactionCreateIsButton";
import "./events/interactionCreateIsChatInputCommand";
import "./events/interactionCreateIsModalSubmit";

client.login(config.discord.token);
start();
