import { type ReactNode } from 'react';
import { TitleBar } from './TitleBar';
import { StatusBar } from './StatusBar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-retro-bg overflow-hidden">
      <TitleBar />
      <div className="flex-1 flex overflow-hidden">{children}</div>
      <StatusBar />
    </div>
  );
}
