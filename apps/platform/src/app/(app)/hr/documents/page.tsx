import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/hr/documents');

export default function Page() {
  return <ModulePage href="/hr/documents" />;
}
