import '@testing-library/jest-dom';
import { ImageData } from 'canvas';

// @ts-expect-error canvas ImageData is compatible with DOM ImageData
global.ImageData = ImageData;
