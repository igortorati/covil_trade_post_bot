import fs from "fs/promises";
import path from "path";
import sequelize from "../config/database";
import Item from "../models/item.model";
import Source from "../models/source.model";
import Rarity from "../models/rarity.model";
import { rarities } from "./seedRarities";

interface RawItem {
  name: string;
  source?: string;
  rarity?: string;
  description?: string;
}

export async function seedItems() {
  // Carrega fontes e raridades válidas
  const [allSources, allRarities] = await Promise.all([
    Source.findAll(),
    Rarity.findAll({ order: [["priority", "ASC"]] }),
  ]);

  await createItems(allRarities, allSources)
  await createUpgrades(allRarities)
}

async function createItems(allRarities: Rarity[], allSources: Source[]) {
  const itemsPath = path.resolve(__dirname, "../data/cleaned-items.json");
  const itemsFile = await fs.readFile(itemsPath, "utf-8");
  const itemData = JSON.parse(itemsFile) as RawItem[];

  const sourceSet = new Set(allSources.map((s) => s.source));
  const raritySet = new Set(allRarities.map((r) => r.id));

  const combinedItems = itemData.map((item) => {
    const source =
      item.source && sourceSet.has(item.source) ? item.source : null;
    const rarity =
      item.rarity && raritySet.has(item.rarity) ? item.rarity : "unknown";

    return {
      name: item.name,
      sourceId: source,
      rarityId: rarity,
      description: item.description || null,
      category: "item",
    };
  });

  await Item.bulkCreate(combinedItems as any, { ignoreDuplicates: true });

  console.log("✅ Itens inseridos com sucesso!");
}

async function createUpgrades(allRarities: Rarity[]) {
  const upgradeRaritiesOffset = 1
  const upgradeItems = ["Weapon", "Armor", "Shield"].flatMap((type) => {
    return [1, 2, 3].map((bonus) => {
      const rarityId = allRarities[bonus + upgradeRaritiesOffset].id ?? allRarities[8];
  
      return {
        name: `+${bonus} ${type}`,
        sourceId: "PHB",
        rarityId: rarityId,
        description: `Um(a) ${type.toLowerCase()} com bônus de +${bonus}.`,
        category: "upgrade",
      };
    });
  });

  await Item.bulkCreate(upgradeItems as any, { ignoreDuplicates: true });

  console.log("✅ Upgrades inseridos com sucesso!");
}

if (require.main === module) {
  sequelize
    .sync()
    .then(async () => {
      await seedItems();
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Erro ao inserir itens:", err);
      process.exit(1);
    });
}
