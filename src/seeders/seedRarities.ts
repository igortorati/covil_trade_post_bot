import Rarity from "../models/rarity.model";
import sequelize from "../config/database";

const rarities = [
  { id: "common", name_pt: "comum" },
  { id: "uncommon", name_pt: "incomum" },
  { id: "rare", name_pt: "raro" },
  { id: "very rare", name_pt: "muito raro" },
  { id: "legendary", name_pt: "lendário" },
  { id: "artifact", name_pt: "artefato" },
  { id: "none", name_pt: "nenhuma" },
  { id: "varies", name_pt: "varia" },
  { id: "unknown", name_pt: "indeterminado" },
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
      console.log("✅ Fontes inseridas com sucesso!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Erro ao inserir fontes:", err);
      process.exit(1);
    });
}
