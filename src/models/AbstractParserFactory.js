const { getEntities, getInnerText } = require('../domain/utils');

function introspect(object, keys, value) {
  let currentObject = object;
  const splitKeys = keys.split('.');
  for (let i = 0; i < splitKeys.length - 1; ++i) {
    const currentKey = splitKeys[i];
    if (!(currentKey in currentObject)) {
      currentObject[currentKey] = {};
    }
    currentObject = currentObject[currentKey];
  }
  currentObject[splitKeys[splitKeys.length - 1]] = value;
}

class AbstractParserBuilder {
  constructor(page) {
    this._resolver = {};
    this._page = page;
  }

  fromSelector(keyName, selector) {
    introspect(this._resolver, keyName, getInnerText(this._page, selector));
    return this;
  }

  fromEntity(selector, subjects) {
    const entities = getEntities(this._page, selector);
    for (const subject of subjects) {
      if (subject.unique) {
        introspect(this._resolver, subject.keyName, entities(subject.keys, subject.merge)[0]);
      } else {
        introspect(this._resolver, subject.keyName, entities(subject.keys, subject.merge));
      }
    }
    return this;
  }

  fromTable(selector, keyName, subjectsMapper) {
    return this;
  }

  getObject() {
    return this._resolver;
  }
}

module.exports = AbstractParserBuilder;
