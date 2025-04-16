import type { Command } from "./commands";
import PingCommand from "./chat/ping";
import TradeCommand from "./chat/trade";

export const commands: Record<string, Command> = {
  ping: new PingCommand(),
  troca: new TradeCommand()
};
