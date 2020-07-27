const CatchableException = require('./CatchableException');

class InquiredDocumentNotFoundException extends CatchableException {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = InquiredDocumentNotFoundException;
