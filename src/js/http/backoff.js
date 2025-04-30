export class ExponentialBackoff {
  constructor(initialDelay = 1000, factor = 2, maxDelay = 30000, jitter = true) {
    this.initial = initialDelay;
    this.factor = factor;
    this.max = maxDelay;
    this.jitter = jitter;
    this.current = initialDelay;
  }

  getNextDelay() {
    let delay = Math.min(this.current, this.max);
    if (this.jitter) {
      const v = delay * 0.5;
      delay = delay - v + Math.random() * v * 2;
    }
    this.current *= this.factor;
    return Math.round(delay);
  }

  reset() {
    this.current = this.initial;
  }
}
