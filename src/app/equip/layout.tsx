'use client';
import { EquipProvider } from './EquipContext';

export default function EquipLayout({ children }: { children: React.ReactNode }) {
  return <EquipProvider>{children}</EquipProvider>;
}
