import Rarity from "../models/rarity.model";
import sequelize from "../config/database";

export const rarities = [
  { id: "none", namePt: "nenhuma", priority: 0 },
  { id: "common", namePt: "comum", priority: 1 },
  { id: "uncommon", namePt: "incomum", priority: 2 },
  { id: "rare", namePt: "raro", priority: 3 },
  { id: "very rare", namePt: "muito raro", priority: 4 },
  { id: "legendary", namePt: "lendário", priority: 5 },
  { id: "artifact", namePt: "artefato", priority: 6 },
  { id: "varies", namePt: "varia", priority: 7 },
  { id: "unknown", namePt: "indeterminado", priority: 8 },
];

async function seedRarities() {
  for (const rarity of rarities) {
    await Rarity.upsert(rarity);
  }
}

if (require.main === module) {
  sequelize
    .sync()
    .then(async () => {
      await seedRarities();
      console.log("✅ Raridades inseridas com sucesso!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Erro ao inserir raridades:", err);
      process.exit(1);
    });
}
