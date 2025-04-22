# DnD DDAL Trade Post Bot - Readme

This project was created for a group of Dungeon Masters (DMs) for the Dungeons & Dragons Adventures League (DDAL) in Brazil. The main purpose of the bot is to manage items for purchase, trade, and season organization, facilitating interactions and transactions between players and DMs.

Most of the messages and commands are displayed in Portuguese (PT-BR) as the focus is on a Brazilian DM group.

## Player Commands

1. **/compra [Character] [Desired Item]**  
   Creates a purchase request for the desired item for the specified character.

2. **/troca [Character] [Desired Item] [Offered Item]**  
   Creates a trade request where the player offers an item in exchange for the desired item for the selected character.

3. **/listar-itens-trocaveis**  
   Lists the items available for trade in the current season.

4. **/listar-itens-compraveis**  
   Lists the items available for purchase in the current season (includes both tradeable and non-tradeable items, such as consumables).

## DM Commands (Season Management)

1. **/criar-temporada [Season Name]**  
   Creates a season with the specified name.

2. **/definir-temporada-atual [Season Name]**  
   Sets the selected season as the current season. This will cause the player commands to only list items associated with this season.

3. **/listar-temporadas**  
   Lists all active seasons registered in the system.

4. **/reativar-temporada [Season Name]**  
   Reactivates a previously deactivated season.

5. **/desativar-temporada [Season Name]**  
   Deactivates a season, making it no longer listed and preventing it from being set as the current season until reactivated (this command is like "deleting" a season, but the items associated with it are preserved to avoid the need to re-add them if the season is mistakenly deleted).

## DM Commands (Character Management)

1. **/adicionar-personagem [Discord User] [Character]**  
   Adds a character to a Discord user. A character cannot be shared among different users.

## DM Commands (Item Management)

1. **/listar-itens-temporada [Season Name]**  
   Lists all items registered for the specified season.

2. **/adicionar-item [Item Name] [Season Name] [Price] [Quantity] [Allows-Trade]**  
   Adds an item to the list of items available for the specified season, with the given price, quantity, and whether it can be traded or only purchased.

3. **/editar-item [id] [Item Name, optional] [Season, optional] [Price, optional] [Quantity, optional] [Allows-Trade, optional]**  
   Edits an item with the specified ID. Only the fields provided will be changed; others will remain the same.

4. **/remover-item [id]**  
   Removes the item with the specified ID from the list of available items for the season.

## DM Commands (Request Management)

1. **/listar-trocas**  
   Lists pending trade requests. Up to 5 requests are displayed at a time to avoid clutter. Each request has a button to approve or reject it.

2. **/listar-compras**  
   Lists pending purchase requests. Up to 5 requests are displayed at a time to avoid clutter. Each request has a button to approve or reject it.

## Notes

1. Once a request is approved or rejected, its status cannot be changed.

2. If a request is made for an item that has run out of stock, the request will disappear from the list, with the status set to "OUT_OF_STOCK" in the database. If the item is restocked, the player can make a new request.
