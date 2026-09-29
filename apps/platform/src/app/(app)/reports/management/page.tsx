import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/reports/management');

export default function Page() {
  return <ModulePage href="/reports/management" />;
}
