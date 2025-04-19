import { REST } from 'discord.js';
import 'dotenv/config';
import { config } from '../config/config';

const rest = new REST().setToken(config.discord.token);

async function clearCommands() {
  try {
    console.log('🧹 Limpando comandos globais...');
    await rest.put(
      `/applications/${config.discord.clientId}/commands`,
      { body: [] }
    );
    console.log('✅ Comandos globais limpos.');

    if (config.discord.guildId) {
      console.log(`🧹 Limpando comandos da guild "${config.discord.guildId}"...`);
      await rest.put(
        `/applications/${config.discord.clientId}/guilds/${config.discord.guildId}/commands`,
        { body: [] }
      );
      console.log('✅ Comandos da guild limpos.');
    }
  } catch (error) {
    console.error('❌ Erro ao limpar comandos:', error);
  }
}

clearCommands();
