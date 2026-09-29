import { redirectToFirstItem } from '@/server/navigation';

export default async function Page() {
  await redirectToFirstItem('finance');
}
