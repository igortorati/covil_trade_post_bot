import Rarity from "../models/rarity.model";

let cachedRarityList: string[] = [];
let lastUpdated: number | null = null;

function isCacheExpired(): boolean {
  if (!lastUpdated) return true;
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return now - lastUpdated > ONE_DAY_MS;
}

async function fetchRarities(): Promise<void> {
  const rarities = await Rarity.findAll({ order: [["priority", "ASC"]] });
  cachedRarityList = rarities.map((r) => r.id.toLowerCase());
  lastUpdated = Date.now();
}

export async function getAllowedRaritiesFrom(
  rarityId: string,
): Promise<string[]> {
  if (isCacheExpired() || cachedRarityList.length === 0) {
    await fetchRarities();
  }

  const lowerRarityId = rarityId.toLowerCase();
  const alwaysIncluded = ["unknown", "varies"];

  if (alwaysIncluded.includes(lowerRarityId)) {
    return cachedRarityList;
  }

  const index = cachedRarityList.indexOf(lowerRarityId);
  if (index === -1) {
    return cachedRarityList;
  }

  const filtered = cachedRarityList.slice(index);

  const finalList = [...new Set([...alwaysIncluded, ...filtered])];

  return finalList;
}
