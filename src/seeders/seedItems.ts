import fs from 'fs/promises';
import path from 'path';
import sequelize from '../config/database';
import Item from '../models/item.model';
import Source from '../models/source.model';
import Rarity from '../models/rarity.model';

interface RawItem {
  name: string;
  source?: string;
  rarity?: string;
  description?: string;
}

export async function seedItems() {
  const itemsPath = path.resolve(__dirname, '../data/cleaned-items.json');
  const itemsFile = await fs.readFile(itemsPath, 'utf-8');
  const itemData = JSON.parse(itemsFile) as RawItem[];

  // Carrega fontes e raridades válidas
  const [allSources, allRarities] = await Promise.all([
    Source.findAll(),
    Rarity.findAll()
  ]);

  const sourceSet = new Set(allSources.map(s => s.source));
  const raritySet = new Set(allRarities.map(r => r.id));

  const combinedItems = itemData.map(item => {
    const source = item.source && sourceSet.has(item.source) ? item.source : null;
    const rarity = item.rarity && raritySet.has(item.rarity) ? item.rarity : 'unknown';

    return {
      name: item.name,
      source_id: source,
      rarity_id: rarity,
      description: item.description || null,
      category: 'item' as const,
    };
  });

  await Item.bulkCreate(combinedItems as any, { ignoreDuplicates: true });

  console.log('✅ Itens inseridos com sucesso!');
}

if (require.main === module) {
  sequelize.sync().then(async () => {
    await seedItems();
    process.exit(0);
  }).catch((err) => {
    console.error('❌ Erro ao inserir itens:', err);
    process.exit(1);
  });
}
