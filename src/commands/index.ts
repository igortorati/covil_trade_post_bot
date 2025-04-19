import type { Command } from "./commands";
import PingCommand from "./chat/ping";
import UndeleteSeasonCommand from "./season/undeleteSeason";
import DeleteSeasonCommand from "./season/deleteSeason";
import NewSeasonCommand from "./season/newSeason";
import SetCurrentSeasonCommand from "./season/setCurrentSeason";
import ListSeasonsCommand from "./season/listSeason";
import ListSeasonItemCommand from "./seasonItems/listSeasonItems";
import AddSeasonItemCommand from "./seasonItems/addSeasonItem";
import AddCharacterCommand from "./character/addCharacter";
import EditSeasonItemCommand from "./seasonItems/editSeasonItem";
import RemoveSeasonItemCommand from "./seasonItems/removeSeasonItem";
import ListTradableItemsOnCurrentSeasonCommand from "./trade/listTradableItems";
import ListPurchasableItemsOnCurrentSeasonCommand from "./purchase/listPurchasableItem";
import TradeRequestCommand from "./trade/tradeRequest";
import PurchaseRequestCommand from "./purchase/purchaseRequest";
import ListTradeRequestCommand from "./trade/listTradeRequest";
import ListPurchaseRequestCommand from "./purchase/listPurchaseRequest";

export const STRING_COMMANDS = {
  REACTIVATE_SEASON: "reativar-temporada",
  DEACTIVATE_SEASON: "desativar-temporada",
  CREATE_SEASON: "criar-temporada",
  SET_CURRENT_SEASON: "definir-temporada-atual",
  LIST_SEASON: "listar-temporadas",
  ADD_CHARACTER: "adicionar-personagem",
  LIST_SEASON_ITEMS: "listar-itens-temporada",
  ADD_ITEM_TO_SEASON: "adicionar-item",
  EDIT_ITEM_IN_SEASON: "editar-item",
  REMOVE_ITEM_FROM_SEASON: "remover-item",
  LIST_TRADABLE_ITEM_FROM_CURRENT_SEASON: "listar-itens-trocaveis",
  LIST_PURCHASABLE_ITEM_FROM_CURRENT_SEASON: "listar-itens-compraveis",
  TRADE: "troca",
  PURCHASE: "compra",
  LIST_TRADE_REQUEST: "listar-trocas",
  LIST_PURCHASE_REQUEST: "listar-compras",
};

export const commands: Record<string, Command> = {
  ping: new PingCommand(),
  [STRING_COMMANDS.REACTIVATE_SEASON]: new UndeleteSeasonCommand(),
  [STRING_COMMANDS.DEACTIVATE_SEASON]: new DeleteSeasonCommand(),
  [STRING_COMMANDS.CREATE_SEASON]: new NewSeasonCommand(),
  [STRING_COMMANDS.SET_CURRENT_SEASON]: new SetCurrentSeasonCommand(),
  [STRING_COMMANDS.LIST_SEASON]: new ListSeasonsCommand(),
  [STRING_COMMANDS.ADD_CHARACTER]: new AddCharacterCommand(),
  [STRING_COMMANDS.LIST_SEASON_ITEMS]: new ListSeasonItemCommand(),
  [STRING_COMMANDS.ADD_ITEM_TO_SEASON]: new AddSeasonItemCommand(),
  [STRING_COMMANDS.EDIT_ITEM_IN_SEASON]: new EditSeasonItemCommand(),
  [STRING_COMMANDS.REMOVE_ITEM_FROM_SEASON]: new RemoveSeasonItemCommand(),
  [STRING_COMMANDS.LIST_TRADABLE_ITEM_FROM_CURRENT_SEASON]:
    new ListTradableItemsOnCurrentSeasonCommand(),
  [STRING_COMMANDS.LIST_PURCHASABLE_ITEM_FROM_CURRENT_SEASON]:
    new ListPurchasableItemsOnCurrentSeasonCommand(),
  [STRING_COMMANDS.TRADE]: new TradeRequestCommand(),
  [STRING_COMMANDS.PURCHASE]: new PurchaseRequestCommand(),
  [STRING_COMMANDS.LIST_TRADE_REQUEST]: new ListTradeRequestCommand(),
  [STRING_COMMANDS.LIST_PURCHASE_REQUEST]: new ListPurchaseRequestCommand(),
};
