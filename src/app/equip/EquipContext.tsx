'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface EquipState {
  loadoutSlug: string;
  agentName: string;
  agentEmoji: string;
  agentRole: string;
  model: string;
  channel: string;
  port: number;
  generatedFiles: {
    soul: string;
    agents: string;
    config: string;
    plist: string;
    deploy: string;
    memory: string;
  } | null;
}

const defaultState: EquipState = {
  loadoutSlug: '',
  agentName: '',
  agentEmoji: '🤖',
  agentRole: '',
  model: 'claude-sonnet-4',
  channel: 'telegram',
  port: 19003,
  generatedFiles: null,
};

const EquipContext = createContext<{
  state: EquipState;
  update: (partial: Partial<EquipState>) => void;
}>({ state: defaultState, update: () => {} });

export function EquipProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EquipState>(defaultState);
  const update = (partial: Partial<EquipState>) => setState(prev => ({ ...prev, ...partial }));
  return <EquipContext.Provider value={{ state, update }}>{children}</EquipContext.Provider>;
}

export const useEquip = () => useContext(EquipContext);
