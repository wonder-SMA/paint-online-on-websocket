class Tool {
  constructor(canvas, socket, id) {
    this.canvas = canvas;
    this.socket = socket;
    this.id = id;
    this.ctx = canvas.getContext('2d');
    this.destroyEvents();
  }

  destroyEvents() {
    this.canvas.onmouseup = null;
    this.canvas.onmousedown = null;
    this.canvas.onmousemove = null;
  }

  set fillColor(color) {
    this.ctx.fillStyle = color;
  }

  set strokeColor(color) {
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width) {
    this.ctx.lineWidth = width;
  }

  getCoords(e) {
    const coords = e.target.getBoundingClientRect();
    return [e.pageX - coords.left, e.pageY - coords.top];
  }
}

export default Tool;