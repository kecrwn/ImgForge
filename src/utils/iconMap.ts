import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {};

// Build the map from lucide-react exports
Object.entries(LucideIcons).forEach(([name, component]) => {
  if (typeof component === 'function' && name !== 'createLucideIcon') {
    iconMap[name] = component as LucideIcon;
  }
});

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || LucideIcons.FileQuestion;
}

export default iconMap;
