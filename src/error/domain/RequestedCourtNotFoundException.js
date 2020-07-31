const CatchableException = require('./CatchableException');

class RequestedCourtNotFoundException extends CatchableException {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = RequestedCourtNotFoundException;
