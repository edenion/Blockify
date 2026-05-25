import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Toolbar } from './components/toolbar/Toolbar';
import { CanvasViewport } from './components/canvas/CanvasViewport';
import { ParamsPanel } from './components/params/ParamsPanel';

export type SelectionTool = 'rectangle' | 'circle' | null;

function App() {
  const [activeTool, setActiveTool] = useState<SelectionTool>(null);

  return (
    <Layout>
      <Toolbar onSelectTool={setActiveTool} activeTool={activeTool} />
      <CanvasViewport selectionTool={activeTool} />
      <ParamsPanel />
    </Layout>
  );
}

export default App;
