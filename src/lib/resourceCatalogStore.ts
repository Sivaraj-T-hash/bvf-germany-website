import { db } from '@/lib/firebase';
import { get, onValue, ref, remove, set } from 'firebase/database';
import { DB_PATHS } from '@/lib/dbPaths';
import { resourceCatalog, type ResourceCatalogItem } from '@/lib/resourceCatalog';

export interface ResourcePackage extends ResourceCatalogItem {
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const RESOURCE_PACKAGES_PATH = DB_PATHS.resourcePackages;
const DEFAULT_TIMESTAMP = '2024-01-01T00:00:00Z';

const defaultResourcePackages: ResourcePackage[] = resourceCatalog.map((item, index) => ({
  ...item,
  published: true,
  sortOrder: index + 1,
  createdAt: DEFAULT_TIMESTAMP,
  updatedAt: DEFAULT_TIMESTAMP,
}));

const normalizeResourcePackage = (
  item: Partial<ResourcePackage> & { id: string },
): ResourcePackage => {
  const fallback = defaultResourcePackages.find((resource) => resource.id === item.id);

  return {
    id: item.id,
    title: item.title ?? fallback?.title ?? 'Untitled resource',
    shortLabel: item.shortLabel ?? fallback?.shortLabel ?? 'Resource',
    department: item.department ?? fallback?.department ?? '',
    priceValue: typeof item.priceValue === 'number' ? item.priceValue : fallback?.priceValue ?? 0,
    originalPriceValue:
      typeof item.originalPriceValue === 'number'
        ? item.originalPriceValue
        : fallback?.originalPriceValue ?? 0,
    rating: item.rating ?? fallback?.rating ?? '',
    reviews: item.reviews ?? fallback?.reviews ?? '',
    viewed: item.viewed ?? fallback?.viewed ?? '',
    badge: item.badge ?? fallback?.badge,
    duration: item.duration ?? fallback?.duration,
    image: item.image ?? fallback?.image ?? '',
    tagline: item.tagline ?? fallback?.tagline ?? '',
    description: item.description ?? fallback?.description ?? '',
    ctaLabel: item.ctaLabel ?? fallback?.ctaLabel ?? 'Buy Now',
    previewNote: item.previewNote ?? fallback?.previewNote,
    bullets: Array.isArray(item.bullets) ? item.bullets : fallback?.bullets ?? [],
    deliverables: Array.isArray(item.deliverables)
      ? item.deliverables
      : fallback?.deliverables ?? [],
    files: Array.isArray(item.files) ? item.files : fallback?.files ?? [],
    published: item.published ?? fallback?.published ?? true,
    sortOrder:
      typeof item.sortOrder === 'number' ? item.sortOrder : fallback?.sortOrder ?? 0,
    createdAt: item.createdAt ?? fallback?.createdAt ?? DEFAULT_TIMESTAMP,
    updatedAt: item.updatedAt ?? fallback?.updatedAt ?? DEFAULT_TIMESTAMP,
  };
};

const sortResources = (resources: ResourcePackage[]) =>
  resources.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

const sanitizeResourcePackage = (item: ResourcePackage) => {
  const entries = Object.entries(item).filter(([, value]) => value !== undefined);
  const base = Object.fromEntries(entries) as Partial<ResourcePackage>;

  if (!item.bullets.length) delete base.bullets;
  if (!item.deliverables?.length) delete base.deliverables;
  if (!item.files?.length) delete base.files;

  return base;
};

export async function getResourcePackages(): Promise<ResourcePackage[]> {
  const snapshot = await get(ref(db, RESOURCE_PACKAGES_PATH));
  if (!snapshot.exists()) {
    return sortResources([...defaultResourcePackages]);
  }
  const value = snapshot.val() as Record<string, Partial<ResourcePackage>>;
  return sortResources(
    Object.values(value)
      .filter((resource): resource is Partial<ResourcePackage> & { id: string } =>
        typeof resource?.id === 'string',
      )
      .map((resource) => normalizeResourcePackage(resource)),
  );
}

export function subscribeToResourceCatalog(
  callback: (items: ResourcePackage[]) => void,
): () => void {
  return onValue(ref(db, RESOURCE_PACKAGES_PATH), (snapshot) => {
    if (!snapshot.exists()) {
      callback(sortResources([...defaultResourcePackages]));
      return;
    }

    const value = snapshot.val() as Record<string, Partial<ResourcePackage>>;
    const normalized = Object.values(value)
      .filter((resource): resource is Partial<ResourcePackage> & { id: string } =>
        typeof resource?.id === 'string',
      )
      .map((resource) => normalizeResourcePackage(resource));

    callback(sortResources(normalized));
  });
}

export async function saveResourcePackage(
  item: ResourcePackage,
): Promise<void> {
  const normalized = normalizeResourcePackage(item);
  await set(ref(db, `${RESOURCE_PACKAGES_PATH}/${normalized.id}`), sanitizeResourcePackage(normalized));
}

export async function deleteResourcePackage(id: string): Promise<void> {
  await remove(ref(db, `${RESOURCE_PACKAGES_PATH}/${id}`));
}
