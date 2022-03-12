/**
 * Class to handle possible state order can be in
 */
export class OrderState {
  static new = new OrderState(0);

  static prepare = new OrderState(1);

  static cooking = new OrderState(2);

  static ready = new OrderState(3);

  static finished = new OrderState(4);

  constructor(val) {
    if (val < 5 && val >= 0) {
      this.val = val;
      return;
    }
    throw new Error('Attempt to initialize to unauthorized state');
  }

  /**
   * Returns state name
   */
  get name() {
    switch (this.val) {
      case 0:
        return 'NEW';
      case 1:
        return 'PREPARE';
      case 2:
        return 'COOKING';
      case 3:
        return 'READY';
      case 4:
        return 'FINISHED';
      default:
        throw new Error('Unauthorized state');
    }
  }

  /**
   * Return OrderState for each possible state
   * @param {string} name "NEW" | "PREPARE" | "COOKING" | "READY" | "FINISHED"
   * @returns OrderState instance for possible state
   */
  static fromString(name) {
    switch (name) {
      case 'NEW':
        return OrderState.new;
      case 'PREPARE':
        return OrderState.prepare;
      case 'COOKING':
        return OrderState.cooking;
      case 'READY':
        return OrderState.ready;
      case 'FINISHED':
        return OrderState.finished;
      default:
        throw new Error('Unauthorized state');
    }
  }

  /**
   * Get next state from current one.
   * @returns next possible state
   */
  getNextState() {
    switch (this.val) {
      case 0:
        return OrderState.prepare;
      case 1:
        return OrderState.cooking;
      case 2:
        return OrderState.ready;
      case 3:
        return OrderState.finished;
      default:
        throw new Error('Attempt to reach unauthorized state');
    }
  }
}
