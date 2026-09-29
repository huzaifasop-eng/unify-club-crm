import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/reports/branch');

export default function Page() {
  return <ModulePage href="/reports/branch" />;
}
