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

// Tokenize text into clean search tokens (avoids redundant regex pass if already normalized)
export function tokenize(str: string, alreadyNormalized = false): string[] {
  if (!str) return [];
  const normalized = alreadyNormalized ? str : normalizeGamingText(str);
  return normalized
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

// Fast tokenization for simple fields (SKU, Brand, Category) that don't need 14 gaming regexes unless they contain 'ps' or 'play' or 'gta'
function tokenizeSimpleOrGaming(lowerStr: string): string[] {
  if (!lowerStr) return [];
  const needsGamingNorm =
    lowerStr.includes('ps') || lowerStr.includes('play') || lowerStr.includes('gta');
  const norm = needsGamingNorm ? normalizeGamingText(lowerStr) : lowerStr;
  return norm
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

// Pre-compile GAMING_SYNONYMS once at module load time (zero runtime regex overhead during search)
const PRETOKENIZED_SYNONYMS: Record<string, string[][]> = {};
const REVERSE_SYNONYM_MAP: Record<string, string[]> = {};

for (const [key, synList] of Object.entries(GAMING_SYNONYMS)) {
  const tokenizedGroups = synList.map(s => tokenize(s));
  PRETOKENIZED_SYNONYMS[key] = tokenizedGroups;

  for (let i = 0; i < synList.length; i++) {
    const rawSyn = synList[i];
    const synTokens = tokenizedGroups[i];
    if (!REVERSE_SYNONYM_MAP[rawSyn]) REVERSE_SYNONYM_MAP[rawSyn] = [];
    if (!REVERSE_SYNONYM_MAP[rawSyn].includes(key)) {
      REVERSE_SYNONYM_MAP[rawSyn].push(key);
    }
    for (const st of synTokens) {
      if (!REVERSE_SYNONYM_MAP[st]) REVERSE_SYNONYM_MAP[st] = [];
      if (!REVERSE_SYNONYM_MAP[st].includes(key)) {
        REVERSE_SYNONYM_MAP[st].push(key);
      }
    }
  }
}

// Reusable static buffer for Levenshtein distance to avoid GC thrashing on mobile
const levRowBuffer = new Int32Array(128);

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const aLen = a.length;
  const bLen = b.length;
  if (!aLen) return bLen;
  if (!bLen) return aLen;

  if (bLen >= levRowBuffer.length) {
    const row = Array.from({ length: bLen + 1 }, (_, i) => i);
    for (let i = 1; i <= aLen; i++) {
      let prev = i;
      for (let j = 1; j <= bLen; j++) {
        const val = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
        row[j - 1] = prev;
        prev = val;
      }
      row[bLen] = prev;
    }
    return row[bLen];
  }

  for (let j = 0; j <= bLen; j++) {
    levRowBuffer[j] = j;
  }

  for (let i = 1; i <= aLen; i++) {
    let prev = i;
    const aCode = a.charCodeAt(i - 1);
    for (let j = 1; j <= bLen; j++) {
      const val =
        aCode === b.charCodeAt(j - 1)
          ? levRowBuffer[j - 1]
          : Math.min(levRowBuffer[j - 1], prev, levRowBuffer[j]) + 1;
      levRowBuffer[j - 1] = prev;
      prev = val;
    }
    levRowBuffer[bLen] = prev;
  }
  return levRowBuffer[bLen];
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
  const firstCode = queryToken.charCodeAt(0);
  if (firstCode >= 48 && firstCode <= 57 && /^\d+$/.test(queryToken)) {
    return targetWord === queryToken;
  }

  // Prefix match for words of length >= 3
  const qLen = queryToken.length;
  const tLen = targetWord.length;
  if (qLen >= 3 && tLen >= qLen && targetWord.startsWith(queryToken)) return true;
  if (qLen >= 4 && tLen >= qLen && targetWord.includes(queryToken)) return true;

  // Typo tolerance:
  if (qLen >= 4 && tLen >= 4) {
    const maxDist = qLen > 6 ? 2 : 1;
    if (Math.abs(qLen - tLen) <= maxDist) {
      if (levenshtein(queryToken, targetWord) <= maxDist) {
        return true;
      }
    }
  }
  return false;
}

interface CompiledQueryToken {
  token: string;
  synonymGroups: string[][];
  reverseKeys: string[];
}

function compileQueryToken(queryToken: string): CompiledQueryToken {
  return {
    token: queryToken,
    synonymGroups: PRETOKENIZED_SYNONYMS[queryToken] || [],
    reverseKeys: REVERSE_SYNONYM_MAP[queryToken] || [],
  };
}

// Check if compiled queryToken matches any of the target words or known synonyms
function matchCompiledTokenInList(
  compiled: CompiledQueryToken,
  targetWords: string[]
): { matched: boolean; isExact: boolean } {
  const len = targetWords.length;
  if (len === 0) return { matched: false, isExact: false };

  const queryToken = compiled.token;

  // 1. Direct match or typo match in product target words
  for (let i = 0; i < len; i++) {
    const word = targetWords[i];
    if (word === queryToken) return { matched: true, isExact: true };
    if (tokenMatchesWord(queryToken, word)) return { matched: true, isExact: false };
  }

  // 2. Gaming synonyms (pre-tokenized)
  const synGroups = compiled.synonymGroups;
  for (let i = 0; i < synGroups.length; i++) {
    const synTokens = synGroups[i];
    let allSynFound = true;
    for (let j = 0; j < synTokens.length; j++) {
      const st = synTokens[j];
      let found = false;
      for (let k = 0; k < len; k++) {
        if (tokenMatchesWord(st, targetWords[k])) {
          found = true;
          break;
        }
      }
      if (!found) {
        allSynFound = false;
        break;
      }
    }
    if (allSynFound) {
      return { matched: true, isExact: false };
    }
  }

  // 3. Reverse synonyms (pre-indexed O(1) lookup)
  const revKeys = compiled.reverseKeys;
  for (let i = 0; i < revKeys.length; i++) {
    const key = revKeys[i];
    for (let k = 0; k < len; k++) {
      const tw = targetWords[k];
      if (tw === key || tokenMatchesWord(key, tw)) {
        return { matched: true, isExact: false };
      }
    }
  }

  return { matched: false, isExact: false };
}

interface IndexedProduct {
  nameNorm: string;
  nameTokens: string[];
  skuLower: string;
  skuTokens: string[];
  brandLower: string;
  brandTokens: string[];
  catNameLower: string;
  catTokens: string[];
  barcodeLower: string;
  hasPs5: boolean;
  hasPs4: boolean;
  hasPs3: boolean;
}

const productIndexCache = new WeakMap<Product, IndexedProduct>();

function getIndexedProduct(p: Product): IndexedProduct {
  let indexed = productIndexCache.get(p);
  if (indexed) return indexed;

  const nameNorm = normalizeGamingText(p.name || '');
  const nameTokens = tokenize(nameNorm, true);
  const skuLower = (p.sku || '').toLowerCase();
  const brandLower = (p.brand || '').toLowerCase();
  const catNameLower =
    typeof p.category === 'object' && p.category?.name
      ? p.category.name.toLowerCase()
      : typeof p.category === 'string'
      ? p.category.toLowerCase()
      : '';
  const barcodeLower = (p.barcode || '').toLowerCase();

  indexed = {
    nameNorm,
    nameTokens,
    skuLower,
    skuTokens: tokenizeSimpleOrGaming(skuLower),
    brandLower,
    brandTokens: tokenizeSimpleOrGaming(brandLower),
    catNameLower,
    catTokens: tokenizeSimpleOrGaming(catNameLower),
    barcodeLower,
    hasPs5: nameTokens.includes('ps5'),
    hasPs4: nameTokens.includes('ps4'),
    hasPs3: nameTokens.includes('ps3'),
  };

  productIndexCache.set(p, indexed);
  return indexed;
}

/**
 * Pre-indexes an array of products so subsequent searches run in < 1ms with zero regex overhead.
 */
export function preindexProducts(products: Product[]): void {
  if (!Array.isArray(products)) return;
  for (let i = 0; i < products.length; i++) {
    getIndexedProduct(products[i]);
  }
}

export interface SmartSearchResult {
  product: Product;
  score: number;
}

export function smartSearchProducts(products: Product[], query: string): Product[] {
  const cleanRawQuery = (query || '').trim();
  if (!cleanRawQuery) return products;

  const normalizedQuery = normalizeGamingText(cleanRawQuery);
  const queryTokens = tokenize(normalizedQuery, true);
  if (queryTokens.length === 0) return products;

  // Pre-compile query tokens once outside the product loop
  const compiledQueryTokens = queryTokens.map(compileQueryToken);
  const qLen = compiledQueryTokens.length;

  // Platform flags for strict generation isolation
  const isPs5Query = queryTokens.includes('ps5');
  const isPs4Query = queryTokens.includes('ps4');
  const isPs3Query = queryTokens.includes('ps3');

  const minRequiredMatches = qLen <= 3 ? qLen : Math.ceil(qLen * 0.75);
  const scored: SmartSearchResult[] = [];

  for (let idx = 0; idx < products.length; idx++) {
    const p = products[idx];
    const indexed = getIndexedProduct(p);

    // STRICT GENERATION ISOLATION:
    // If user searched for PS5: NEVER match products that have PS4 in name (unless they also say PS5)
    if (isPs5Query && indexed.hasPs4 && !indexed.hasPs5) {
      continue;
    }
    // If user searched for PS4: NEVER match PS5 products
    if (isPs4Query && indexed.hasPs5 && !indexed.hasPs4) {
      continue;
    }
    // If user searched for PS3: NEVER match PS4/PS5 products
    if (isPs3Query && (indexed.hasPs4 || indexed.hasPs5) && !indexed.hasPs3) {
      continue;
    }

    let totalScore = 0;
    let matchedTokenCount = 0;
    let matchedInNameCount = 0;

    // Highest priority: exact phrase in normalized product name
    if (indexed.nameNorm.includes(normalizedQuery)) {
      totalScore += 350;
    }
    // Exact SKU match
    if (indexed.skuLower === normalizedQuery || (indexed.barcodeLower && indexed.barcodeLower === normalizedQuery)) {
      totalScore += 300;
    }

    // Check each compiled query token
    for (let i = 0; i < qLen; i++) {
      const cToken = compiledQueryTokens[i];
      const nameMatch = matchCompiledTokenInList(cToken, indexed.nameTokens);
      const skuMatch = matchCompiledTokenInList(cToken, indexed.skuTokens);
      const brandMatch = matchCompiledTokenInList(cToken, indexed.brandTokens);
      const catMatch = matchCompiledTokenInList(cToken, indexed.catTokens);

      if (nameMatch.matched || skuMatch.matched || brandMatch.matched || catMatch.matched) {
        matchedTokenCount++;

        if (nameMatch.matched) {
          matchedInNameCount++;
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

    if (matchedTokenCount >= minRequiredMatches) {
      // Big Bonus if all query tokens appear in the product name (already tracked above, 0 extra work!)
      if (matchedInNameCount === qLen) {
        totalScore += 120;
      }

      // Bonus if platform matches target (e.g. ps5 in ps5)
      if (isPs5Query && indexed.hasPs5) {
        totalScore += 100;
      }
      if (isPs4Query && indexed.hasPs4) {
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
