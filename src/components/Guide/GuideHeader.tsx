
import { UnifiedHeader } from '../Header/UnifiedHeader';

interface GuideHeaderProps {
  onNavigate: (value: string) => void;
  currentTab: string;
}

export function GuideHeader({ onNavigate, currentTab }: GuideHeaderProps) {
  return <UnifiedHeader />;
}
