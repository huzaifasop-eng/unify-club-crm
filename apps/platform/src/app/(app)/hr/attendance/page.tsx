import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/hr/attendance');

export default function Page() {
  return <ModulePage href="/hr/attendance" />;
}
