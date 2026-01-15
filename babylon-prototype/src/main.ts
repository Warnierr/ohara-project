import { GameApp } from './GameApp';
import './style.css';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

if (canvas) {
  new GameApp(canvas);
}
