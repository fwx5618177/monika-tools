import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import VideoEnhance from './VideoEnhance';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VideoEnhance />
  </StrictMode>
);
