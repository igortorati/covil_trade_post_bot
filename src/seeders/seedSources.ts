import fs from 'fs/promises';
import path from 'path';
import Source from '../models/source.model';
import sequelize from '../config/database';

export async function seedSources() {
  const dataPath = path.resolve(__dirname, '../data/sources.json');
  const file = await fs.readFile(dataPath, 'utf-8');
  const json = JSON.parse(file);

  const sources = json.map((b: any) => ({
    source: b.source,
    name: b.name,
    published: b.published || null,
    author: b.author || null,
  }));

  await Source.bulkCreate(sources, { ignoreDuplicates: true });
}

if (require.main === module) {
  sequelize.sync().then(async () => {
    await seedSources();
    console.log('✅ Fontes inseridas com sucesso!');
    process.exit(0);
  }).catch((err) => {
    console.error('❌ Erro ao inserir fontes:', err);
    process.exit(1);
  });
}