export class IntervalController {
  public running = false;
  private lastTime = 0;
  private interval = 0;
  private callback = () => {};

  constructor(callback: () => void, interval: number) {
    this.callback = callback;
    this.interval = interval;
    this.lastTime = 0;
    this.running = false;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.loop();
    }
  }

  stop() {
    this.running = false;
  }

  setInterval(newInterval: number) {
    this.interval = newInterval;
    this.lastTime = performance.now();
  }

  private loop = (time = 0) => {
    if (!this.running) return;

    if (time - this.lastTime >= this.interval) {
      this.callback();
      this.lastTime = time;
    }

    requestAnimationFrame(this.loop);
  };
}
