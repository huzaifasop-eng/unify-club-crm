import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/sales/leads');

export default function Page() {
  return <ModulePage href="/sales/leads" />;
}
