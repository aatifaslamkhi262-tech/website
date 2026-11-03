import { Product } from './types';

// Gaming Synonyms dictionary
const GAMING_SYNONYMS: Record<string, string[]> = {
  ps5: ['playstation 5', 'playstation5', 'play station 5', 'ps 5', 'sony ps5'],
  ps4: ['playstation 4', 'playstation4', 'play station 4', 'ps 4', 'sony ps4'],
  ps3: ['playstation 3', 'playstation3'],
  controller: ['dualsense', 'gamepad', 'joystick', 'remote', 'pad', 'dual sense', 'wireless controller'],
  dualsense: ['controller', 'gamepad', 'joystick', 'pad'],
  cd: ['disc', 'disk', 'game', 'cds', 'games'],
  disc: ['cd', 'disk', 'game'],
  disk: ['cd', 'disc', 'game'],
  game: ['cd', 'disc'],
  games: ['cds', 'discs'],
  xbox: ['series x', 'series s', 'microsoft', 'xbox series'],
  switch: ['nintendo', 'nintendo switch', 'oled'],
  fat: ['standard edition', 'standard', 'disc edition'],
  slim: ['slim edition'],
  pro: ['pro edition'],
  gta: ['grand theft auto', 'gta5', 'gta v', 'gta 5'],
  gta5: ['grand theft auto', 'gta v', 'gta 5'],
  spiderman: ['spider man', 'spider-man', 'marvel'],
  cod: ['call of duty', 'warzone', 'black ops', 'modern warfare'],
  rdr: ['red dead redemption', 'rdr2'],
  gow: ['god of war', 'ragnarok'],
  wukong: ['black myth', 'black myth wukong'],
};

// Normalize compound gaming words (e.g., 'ps 5' -> 'ps5', 'gta 5' -> 'gta5')
export function normalizeGamingText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\bps\s*5\b/gi, 'ps5')
    .replace(/\bps\s*4\b/gi, 'ps4')
    .replace(/\bps\s*3\b/gi, 'ps3')
    .replace(/\bps\s*2\b/gi, 'ps2')
    .replace(/\bplaystation\s*5\b/gi, 'ps5')
    .replace(/\bplaystation\s*4\b/gi, 'ps4')
    .replace(/\bplaystation\s*3\b/gi, 'ps3')
    .replace(/\bplaystation\s*2\b/gi, 'ps2')
    .replace(/\bplay\s*station\s*5\b/gi, 'ps5')
    .replace(/\bplay\s*station\s*4\b/gi, 'ps4')
    .replace(/\bgta\s*5\b/gi, 'gta5')
    .replace(/\bgta\s*v\b/gi, 'gta5')
    .replace(/\bgta\s*6\b/gi, 'gta6')
    .replace(/\bgta\s*vi\b/gi, 'gta6');
}

// Tokenize text into clean search tokens
export function tokenize(str: string): string[] {
  if (!str) return [];
  const normalized = normalizeGamingText(str);
  return normalized
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

// Levenshtein distance for typo tolerance
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Check if token matches target word or is fuzzy match
function tokenMatchesWord(queryToken: string, targetWord: string): boolean {
  if (queryToken === targetWord) return true;

  // Platform generation isolation: 'ps4' and 'ps5' must never match each other
  if ((queryToken === 'ps4' && targetWord === 'ps5') || (queryToken === 'ps5' && targetWord === 'ps4')) {
    return false;
  }
  if (queryToken === 'ps' && (targetWord === 'ps4' || targetWord === 'ps5' || targetWord === 'ps3')) {
    return false;
  }

  // Pure numbers (like '5' or '4'): MUST match exactly, never prefix!
  // e.g. '5' must NOT match '500' or '500gb'!
  if (/^\d+$/.test(queryToken)) {
    return targetWord === queryToken;
  }

  // Prefix match for words of length >= 3
  if (queryToken.length >= 3 && targetWord.startsWith(queryToken)) return true;
  if (queryToken.length >= 4 && targetWord.includes(queryToken)) return true;

  // Typo tolerance:
  if (queryToken.length >= 4 && targetWord.length >= 4) {
    const maxDist = queryToken.length > 6 ? 2 : 1;
    if (Math.abs(queryToken.length - targetWord.length) <= maxDist) {
      if (levenshtein(queryToken, targetWord) <= maxDist) {
        return true;
      }
    }
  }
  return false;
}

// Check if queryToken matches any of the target words or known synonyms
function matchTokenInList(queryToken: string, targetWords: string[]): { matched: boolean; isExact: boolean } {
  // 1. Direct match or typo match in product target words
  for (const word of targetWords) {
    if (word === queryToken) return { matched: true, isExact: true };
    if (tokenMatchesWord(queryToken, word)) return { matched: true, isExact: false };
  }

  // 2. Gaming synonyms
  const synonyms = GAMING_SYNONYMS[queryToken];
  if (synonyms) {
    for (const syn of synonyms) {
      const synTokens = tokenize(syn);
      const allSynFound = synTokens.every(st => targetWords.some(tw => tokenMatchesWord(st, tw)));
      if (allSynFound) {
        return { matched: true, isExact: false };
      }
    }
  }

  // 3. Reverse synonyms
  for (const [key, synList] of Object.entries(GAMING_SYNONYMS)) {
    if (synList.some(s => s === queryToken || tokenize(s).includes(queryToken))) {
      if (targetWords.includes(key) || targetWords.some(tw => tokenMatchesWord(key, tw))) {
        return { matched: true, isExact: false };
      }
    }
  }

  return { matched: false, isExact: false };
}

export interface SmartSearchResult {
  product: Product;
  score: number;
}

export function smartSearchProducts(products: Product[], query: string): Product[] {
  const cleanRawQuery = (query || '').trim();
  if (!cleanRawQuery) return products;

  const normalizedQuery = normalizeGamingText(cleanRawQuery);
  const queryTokens = tokenize(normalizedQuery);
  if (queryTokens.length === 0) return products;

  // Platform flags for strict generation isolation
  const isPs5Query = queryTokens.includes('ps5');
  const isPs4Query = queryTokens.includes('ps4');
  const isPs3Query = queryTokens.includes('ps3');

  const scored: SmartSearchResult[] = [];

  for (const p of products) {
    const nameNorm = normalizeGamingText(p.name || '');
    const nameTokens = tokenize(nameNorm);

    // STRICT GENERATION ISOLATION:
    // If user searched for PS5: NEVER match products that have PS4 in name (unless they also say PS5)
    if (isPs5Query && nameTokens.includes('ps4') && !nameTokens.includes('ps5')) {
      continue;
    }
    // If user searched for PS4: NEVER match PS5 products
    if (isPs4Query && nameTokens.includes('ps5') && !nameTokens.includes('ps4')) {
      continue;
    }
    // If user searched for PS3: NEVER match PS4/PS5 products
    if (isPs3Query && (nameTokens.includes('ps4') || nameTokens.includes('ps5')) && !nameTokens.includes('ps3')) {
      continue;
    }

    const skuLower = (p.sku || '').toLowerCase();
    const brandLower = (p.brand || '').toLowerCase();
    const catNameLower = typeof p.category === 'object' && p.category?.name ? p.category.name.toLowerCase() : (typeof p.category === 'string' ? p.category.toLowerCase() : '');
    const barcodeLower = (p.barcode || '').toLowerCase();

    const skuTokens = tokenize(skuLower);
    const brandTokens = tokenize(brandLower);
    const catTokens = tokenize(catNameLower);

    let totalScore = 0;
    let matchedTokenCount = 0;

    // Highest priority: exact phrase in normalized product name
    if (nameNorm.includes(normalizedQuery)) {
      totalScore += 350;
    }
    // Exact SKU match
    if (skuLower === normalizedQuery || barcodeLower === normalizedQuery) {
      totalScore += 300;
    }

    // Check each query token
    for (const qToken of queryTokens) {
      const nameMatch = matchTokenInList(qToken, nameTokens);
      const skuMatch = matchTokenInList(qToken, skuTokens);
      const brandMatch = matchTokenInList(qToken, brandTokens);
      const catMatch = matchTokenInList(qToken, catTokens);

      if (nameMatch.matched || skuMatch.matched || brandMatch.matched || catMatch.matched) {
        matchedTokenCount++;

        if (nameMatch.matched) {
          totalScore += nameMatch.isExact ? 80 : 45;
        }
        if (skuMatch.matched) {
          totalScore += skuMatch.isExact ? 30 : 15;
        }
        if (brandMatch.matched) {
          totalScore += brandMatch.isExact ? 30 : 20;
        }
        if (catMatch.matched) {
          totalScore += catMatch.isExact ? 25 : 15;
        }
      }
    }

    // Require either all tokens or 75% of tokens
    const minRequiredMatches = queryTokens.length <= 3 ? queryTokens.length : Math.ceil(queryTokens.length * 0.75);

    if (matchedTokenCount >= minRequiredMatches) {
      // Big Bonus if all query tokens appear in the product name
      const allInName = queryTokens.every(qt => matchTokenInList(qt, nameTokens).matched);
      if (allInName) {
        totalScore += 120;
      }

      // Bonus if platform matches target (e.g. ps5 in ps5)
      if (isPs5Query && nameTokens.includes('ps5')) {
        totalScore += 100;
      }
      if (isPs4Query && nameTokens.includes('ps4')) {
        totalScore += 100;
      }

      // Bonus for stock availability
      if (p.inStock && (p.warehouseStock === undefined || p.warehouseStock > 0)) {
        totalScore += 50;
        totalScore += Math.min(p.warehouseStock || 0, 10);
      } else {
        totalScore -= 200;
      }

      scored.push({ product: p, score: totalScore });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.map(s => s.product);
}
