import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useHistory() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          const store = useAppStore.getState();
          if (e.shiftKey) {
            store.redo();
          } else {
            store.undo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
