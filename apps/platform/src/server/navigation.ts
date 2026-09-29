import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { NAVIGATION } from '@/config/navigation';
import { getModule, type ModuleHref } from '@/config/modules';
import { filterNavigation, findGroup } from '@/lib/navigation';
import { canFrom } from '@/lib/permissions';
import { getCurrentPermissions } from './session';

/** `/sales`, `/hr`, … land on the first page in that section the user may open. */
export async function redirectToFirstItem(groupId: string): Promise<never> {
  const nav = filterNavigation(NAVIGATION, canFrom(await getCurrentPermissions()));
  const group = findGroup(nav, groupId);
  const first = group?.items.find((item) => !item.alias && item.href.startsWith(group.basePath));
  if (!first) notFound();
  redirect(first.href);
}

export function moduleMetadata(href: ModuleHref): Metadata {
  const mod = getModule(href);
  return { title: mod.title, description: mod.description };
}
