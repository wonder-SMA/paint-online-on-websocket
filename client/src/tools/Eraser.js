import Brush from './Brush';
import canvasStore from '../store/canvasStore';

class Eraser extends Brush {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  handleMouseMove(e) {
    if (canvasStore.mouseDown) {
      let [x, y] = [...this.getCoords(e)];
      this.draw(x, y);
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'eraser',
          x,
          y
        }
      }));
    }
  }
}

export default Eraser;