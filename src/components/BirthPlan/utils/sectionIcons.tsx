
import { 
  User, 
  Sun, 
  HeartPulse,
  Baby, 
  Scissors, 
  Heart,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';

export const getSectionIcon = (sectionId: string): LucideIcon | null => {
  const iconMap: Record<string, LucideIcon> = {
    'personal': User,
    'atmosphere': Sun,
    'laborPreferences': HeartPulse,
    'birth': Baby,
    'cesarean': Scissors,
    'postpartum': Heart,
    'specialSituations': AlertTriangle
  };
  
  return iconMap[sectionId] || null;
};
