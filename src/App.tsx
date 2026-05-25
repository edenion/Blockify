import { Layout } from './components/layout/Layout';
import { Toolbar } from './components/toolbar/Toolbar';
import { CanvasViewport } from './components/canvas/CanvasViewport';
import { ParamsPanel } from './components/params/ParamsPanel';

function App() {
  return (
    <Layout>
      <Toolbar />
      <CanvasViewport />
      <ParamsPanel />
    </Layout>
  );
}

export default App;
