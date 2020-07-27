class CatchableException {
  constructor(message, code = 500) {
    this.name = String(this.constructor.name);
    this.message = message;
    this.code = code;
  }
}

module.exports = CatchableException;
