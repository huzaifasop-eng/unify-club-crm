import { ModulePage } from '@/components/module/module-page';
import { moduleMetadata } from '@/server/navigation';

export const metadata = moduleMetadata('/operations/tasks');

export default function Page() {
  return <ModulePage href="/operations/tasks" />;
}
