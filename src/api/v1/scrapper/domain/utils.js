function normalizeHTMLString(str) {
  return str.replace(/[\n|\t]/g, '').replace(/ +/g, ' ').trim();
}

function getInnerText(page, selector, context) {
  return normalizeHTMLString(page(selector, context).text());
}

function parseEntities(text, delimiter = ':') {
  const shattered = [].concat.apply([], (text.split(delimiter).map((str) => str.split('<>').map(normalizeHTMLString).filter((e) => e.length > 0))));
  const entities = {};
  for (let i = 0; i < shattered.length; i += 2) {
    const entityName = shattered[i];
    const entityValue = shattered[i + 1];
    if (!(entityName in entities)) {
      entities[entityName] = [];
    }
    entities[entityName].push(entityValue);
  }

  return entities;
}

function getEntitiesFromString(str, delimiter = ':', { raw } = { raw: false }) {
  const text = str.replace(/\n+/g, '<>').replace(/ +/, ' ').replace(/(\d+):(\d+)/g, '$1<comma>$2')
    .trim();

  const entities = parseEntities(text, delimiter);

  if (raw) {
    return entities;
  }

  function gather(keyList, merge = false) {
    if (Array.isArray(keyList)) {
      if (merge) {
        let merged = [];
        for (const key of keyList) {
          if (key in entities) {
            merged = merged.concat(entities[key]);
          }
        }
        return merged.length > 0 ? merged : undefined;
      }
      for (const key of keyList) {
        if (key in entities) {
          return entities[key];
        }
      }
    }
    return entities[keyList];
  }

  return gather;
}

function getEntities(page, selector, delimiter = ':', { context, raw } = { context: undefined, raw: false }) {
  const text = page(selector, context).text().replace(/\n+/g, '<>').replace(/ +/, ' ')
    .replace(/(\d+):(\d+)/g, '$1<comma>$2')
    .trim();

  const entities = parseEntities(text, delimiter);

  if (raw) {
    return entities;
  }

  function gather(keyList, merge = false) {
    if (Array.isArray(keyList)) {
      if (merge) {
        let merged = [];
        for (const key of keyList) {
          if (key in entities) {
            merged = merged.concat(entities[key]);
          }
        }
        return merged.length > 0 ? merged : undefined;
      }
      for (const key of keyList) {
        if (key in entities) {
          return entities[key];
        }
      }
    }
    return entities[keyList];
  }

  return gather;
}

module.exports = {
  getEntitiesFromString,
  normalizeHTMLString,
  getInnerText,
  getEntities,
};
