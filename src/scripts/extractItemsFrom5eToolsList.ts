import fs from "fs/promises";
import path from "path";
import { RawItem } from "../interfaces/rawItemInterface";
import { writeFileSync } from "fs";

// Command to generate all items from 5etools: "Renderer.item.pGetSiteUnresolvedRefItems()"
// To use this command, just setup the 5eTools localy ("npm i", "npm run build:sw:prod" e "npm run serve:dev") at page localhost:5050 open the console and type "Renderer.item.pGetSiteUnresolvedRefItems()". Remove items with the following properties:
// __prop: "itemGroup",
// _isItemGroup: true
// _category: "Generic Variant"
// __prop: "magicvariant"
// 
// the file containing the generated items will not be uploaded to github because of its size. Only the file with the cleaned items will be uploaded.


async function getAllItems() {
  const itemsPath = path.resolve(__dirname, "../data/all-generated-items.json");
  const itemsFile = await fs.readFile(itemsPath, "utf-8");
  const itemData = JSON.parse(itemsFile);
  const extractedItems = [] as RawItem[];

  const filteredData = itemData.filter((item: { _isItemGroup: any; __prop: string; _category: string; }) => !(item._isItemGroup || item.__prop == "magicvariant" || item._category == "Generic Variant" || item.__prop == "itemGroup"));
  
  filteredData.forEach((item: { name: any; source: any; rarity: any; _fMisc: string | string[]; }) => {
    const extractedItem = {
      name: item.name,
      source: item.source,
      rarity: item.rarity,
      isConsumable: item._fMisc && item._fMisc.includes("Consumable") || undefined,
      isMagical: item._fMisc && item._fMisc.includes("Magic") || undefined,
      isMundane: item._fMisc && item._fMisc.includes("Mundane") || undefined,
      isLegacy: item._fMisc && item._fMisc.includes("Legacy") || undefined,
    } as RawItem

    if (!["+1 Shield", "+2 Shield", "+3 Shield"].includes(item.name)) {
      extractedItems.push(extractedItem);
    }
  })

  console.log("Saving all extracted items to file, amount: ", extractedItems.length + 1)

  const jsonString: string = JSON.stringify(extractedItems, null, 2);

  writeFileSync(path.resolve(__dirname, "../data/cleaned-items.json"), jsonString);
}


getAllItems()