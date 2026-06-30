import { ComingSoon } from '@/components/shared/coming-soon';
import { COMING_SOON_MODULES } from '@/lib/nav-config';

export default function Page() {
  const mod = COMING_SOON_MODULES['notifications'];
  return <ComingSoon icon={mod.icon} title={mod.title} description={mod.description} />;
}
