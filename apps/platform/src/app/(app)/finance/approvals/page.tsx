import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/finance/approvals');

export default function Page() {
  return <ModulePage href="/finance/approvals" />;
}
