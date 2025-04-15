import type { Command } from "./commands";
import PingCommand from "./chat/ping";
import SugestaoCommand from "./chat/sugestao";
import SelectFrutaCommand from "./chat/selectFruta";
import TradeCommand from "./chat/trade";

export const commands: Record<string, Command> = {
  ping: new PingCommand(),
  sugestao: new SugestaoCommand(),
  selectfruta: new SelectFrutaCommand(),
  trade: new TradeCommand(),
};
