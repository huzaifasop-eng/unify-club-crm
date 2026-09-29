import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/sales/follow-ups');

export default function Page() {
  return <ModulePage href="/sales/follow-ups" />;
}
