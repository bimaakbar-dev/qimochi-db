// src/lib/anime.ts
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type RelationType =
  | 'sequel' | 'prequel' | 'side_story' | 'parent_story' | 'alternative'
  | 'spin_off' | 'adaptation' | 'character' | 'summary' | 'full_story'
  | 'compilation' | 'contains' | 'other';

export interface Franchise {
  relation: RelationType;
  slug: string;
  title?: string;
}

export interface EpisodeListItem {
  number: number;
  title: string;
  aired?: string;
  duration?: number;
}

export interface VoiceActor {
  id: string;
  name: string;
  nameNative?: string;
  image?: string;
  defaultLanguage?: string;
}

export interface CharacterVoiceActor {
  id: string;
  language?: string;
}

export interface Character {
  name: string;
  nameNative?: string;
  image?: string;
  role: 'main' | 'supporting' | 'background';
  voiceActors: CharacterVoiceActor[];
}

export interface HydratedVoiceActor extends VoiceActor {
  language: string;
}

export interface HydratedCharacter extends Omit<Character, 'voiceActors'> {
  voiceActors: HydratedVoiceActor[];
}

export type AnimeEntry = CollectionEntry<'anime'>;

export type HydratedAnime = Omit<AnimeEntry, 'data'> & {
  data: AnimeEntry['data'] & {
    franchises: Franchise[];
    episodeList: EpisodeListItem[];
    characters: HydratedCharacter[];
  };
};

const voiceActorModules = import.meta.glob<{ default: VoiceActor[] }>(
  '../data/actors/*.json',
  { eager: true }
);

const voiceActorsById: Record<string, VoiceActor> = {};

for (const mod of Object.values(voiceActorModules)) {
  if (!Array.isArray(mod.default)) continue;
  for (const va of mod.default) {
    if (va && typeof va.id === 'string') {
      voiceActorsById[va.id] = va;
    }
  }
}

const franchiseModules = import.meta.glob<{ default: Franchise[] }>(
  '../data/anime/*/franchises.json',
  { eager: true }
);

const franchisesBySlug: Record<string, Franchise[]> = {};

for (const [path, mod] of Object.entries(franchiseModules)) {
  const match = path.match(/\/data\/anime\/([^/]+)\/franchises\.json$/);
  if (!match) continue;
  const slug = match[1];
  if (!slug) continue;
  franchisesBySlug[slug] = Array.isArray(mod.default) ? mod.default : [];
}

interface ChunkRef {
  slug: string;
  start: number;
  end: number;
  path: string;
}

function collectChunks<T>(
  modules: Record<string, { default: T[] }>,
  section: 'episodes' | 'characters'
): Record<string, T[]> {
  const chunksBySlug: Record<string, ChunkRef[]> = {};

  for (const path of Object.keys(modules)) {
    const re = new RegExp(
      `/data/anime/([^/]+)/${section}/(\\d+)-(\\d+)\\.json$`
    );
    const match = path.match(re);
    if (!match) continue;

    const slug = match[1];
    const start = parseInt(match[2] ?? '0', 10);
    const end = parseInt(match[3] ?? '0', 10);
    if (!slug || isNaN(start) || isNaN(end)) continue;

    if (!chunksBySlug[slug]) chunksBySlug[slug] = [];
    chunksBySlug[slug]!.push({ slug, start, end, path });
  }

  const result: Record<string, T[]> = {};

  for (const [slug, chunks] of Object.entries(chunksBySlug)) {
    chunks.sort((a, b) => a.start - b.start);

    const merged: T[] = [];
    for (const chunk of chunks) {
      const mod = modules[chunk.path];
      if (!mod || !Array.isArray(mod.default)) continue;
      merged.push(...mod.default);
    }

    result[slug] = merged;
  }

  return result;
}

const episodesModules = import.meta.glob<{ default: EpisodeListItem[] }>(
  '../data/anime/*/episodes/*.json',
  { eager: true }
);

const charactersModules = import.meta.glob<{ default: Character[] }>(
  '../data/anime/*/characters/*.json',
  { eager: true }
);

const episodesBySlug = collectChunks<EpisodeListItem>(
  episodesModules,
  'episodes'
);

const charactersBySlug = collectChunks<Character>(
  charactersModules,
  'characters'
);

function hydrateCharacter(raw: Character): HydratedCharacter {
  const hydratedVAs: HydratedVoiceActor[] = [];

  for (const cva of raw.voiceActors ?? []) {
    let id: string | null = null;
    let languageOverride: string | undefined;

    if (typeof cva === 'string') {
      id = cva;
    } else if (cva && typeof cva === 'object' && typeof cva.id === 'string') {
      id = cva.id;
      languageOverride = cva.language;
    }

    if (!id) continue;

    const master = voiceActorsById[id];
    if (!master) continue;

    hydratedVAs.push({
      ...master,
      language: languageOverride ?? master.defaultLanguage ?? 'Japanese',
    });
  }

  return {
    ...raw,
    voiceActors: hydratedVAs,
  };
}

async function hydrateOne(anime: AnimeEntry): Promise<HydratedAnime> {
  const slug = anime.id;
  const rawCharacters = charactersBySlug[slug] ?? [];

  return {
    ...anime,
    data: {
      ...anime.data,
      franchises: franchisesBySlug[slug] ?? [],
      episodeList: episodesBySlug[slug] ?? [],
      characters: rawCharacters.map(hydrateCharacter),
    },
  };
}

export async function getAllAnime(): Promise<HydratedAnime[]> {
  const all = await getCollection(
    'anime',
    (entry: AnimeEntry) => !entry.data.draft
  );
  return Promise.all(all.map(hydrateOne));
}

export async function getAnimeById(
  id: string
): Promise<HydratedAnime | null> {
  const anime = await getEntry('anime', id);
  if (!anime || anime.data.draft) return null;
  return hydrateOne(anime);
}