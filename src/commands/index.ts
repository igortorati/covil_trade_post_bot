import type { Command } from "./commands";
import PingCommand from "./chat/ping";
import UndeleteSeasonCommand from "./season/undeleteSeason";
import DeleteSeasonCommand from "./season/deleteSeason";
import NewSeasonCommand from "./season/newSeason";
import SetCurrentSeasonCommand from "./season/setCurrentSeason";
import ListSeasonsCommand from "./season/listSeason";
import ListSeasonItemsCommand from "./seasonItems/listSeasonItems";
import AddSeasonItemCommand from "./seasonItems/addSeasonItem";
import AddCharacterCommand from "./character/addCharacter";
import EditSeasonItemCommand from "./seasonItems/editSeasonItem";
import RemoveSeasonItemCommand from "./seasonItems/removeSeasonItem";
import ListTradableItemsOnCurrentSeasonCommand from "./trade/listTradableItems";
import ListPurchasableItemsOnCurrentSeasonCommand from "./purchase/listPurchasableItems";

export const commands: Record<string, Command> = {
  ping: new PingCommand(),
  "reativar-temporada": new UndeleteSeasonCommand(),
  "desativar-temporada": new DeleteSeasonCommand(),
  "nova-temporada": new NewSeasonCommand(),
  "definir-temporada-atual": new SetCurrentSeasonCommand(),
  "listar-temporadas": new ListSeasonsCommand(),
  "adicionar-personagem": new AddCharacterCommand(),
  "listar-itens-temporada": new ListSeasonItemsCommand(),
  "adicionar-item": new AddSeasonItemCommand(),
  "editar-item": new EditSeasonItemCommand(),
  "remover-item": new RemoveSeasonItemCommand(),
  "listar-itens-trocaveis": new ListTradableItemsOnCurrentSeasonCommand(),
  "listar-itens-compraveis": new ListPurchasableItemsOnCurrentSeasonCommand(),
};
