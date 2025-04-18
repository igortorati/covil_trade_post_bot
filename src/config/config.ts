import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN é obrigatório"),
  DISCORD_CLIENT_ID: z.string().min(1, "DISCORD_CLIENT_ID é obrigatório"),
  DISCORD_GUILD_ID: z.string().min(1, "DISCORD_GUILD_ID é obrigatório"),

  DB_HOST: z.string().min(1, "DB_HOST é obrigatório"),
  DB_PORT: z
    .string()
    .transform(Number)
    .refine((port: number) => !isNaN(port), {
      message: "DB_PORT deve ser um número válido",
    }),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Erro ao validar variáveis de ambiente:",
    parsed.error.format(),
  );
  process.exit(1);
}

export const config = {
  discord: {
    token: parsed.data.DISCORD_TOKEN,
    clientId: parsed.data.DISCORD_CLIENT_ID,
    guildId: parsed.data.DISCORD_GUILD_ID,
  },
  db: {
    host: parsed.data.DB_HOST,
    port: parsed.data.DB_PORT,
    username: parsed.data.DB_USERNAME,
    password: parsed.data.DB_PASSWORD,
    database: parsed.data.DB_DATABASE,
  },
};
