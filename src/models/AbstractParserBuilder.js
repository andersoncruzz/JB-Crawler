const {getEntities, getEntitiesFromString, getInnerText} = require('../api/v1/scrapper/domain/utils');

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

function defaultEntityParser(entity) {
    return entity;
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

        if (!Array.isArray(subjects)) {
            introspect(this._resolver, subjects, getEntities(this._page, selector, ':', {raw: true}));
            return this;
        } else {
            const entities = getEntities(this._page, selector);
            for (const subject of subjects) {
                const parser = subject.parser || defaultEntityParser;
                const entry = entities(subject.keys, subject.merge);
                if (entry) {
                    introspect(this._resolver, subject.keyName, parser(subject.unique ? entry[0] : entry));
                } else {
                    introspect(this._resolver, subject.keyName, null);
                }
            }
            return this;
        }
    }

    fromTableAsGenericEntities(selector, keyName) {
        const entries = [];
        this._page(selector).toArray().forEach((item) => {
            const entities = Object.entries(getEntitiesFromString(this._page('>', item).text(), ':', {raw: true}))
                .reduce((accumulator, [key, value]) => {
                    if (Array.isArray(value)) {
                        if (value.length === 1) {
                            accumulator[key] = value[0];
                        } else if (value.length > 1) {
                            accumulator[key] = value;
                        }
                    } else {
                        accumulator[key] = value
                    }
                    return accumulator;
                }, {});
            entries.push(entities);
        });

        introspect(this._resolver, keyName, entries);

        return this;
    }

    fromTableAsEntity(selector, keyName, subjects) {
        const entries = {};
        this._page(selector).toArray().forEach((item) => {
            const entities = getEntitiesFromString(this._page('>', item).text(), ':');
            for (const subject of subjects) {
                const recoveredSubject = entities(subject.keys, subject.merge);
                const parser = subject.parser || defaultEntityParser;
                if (recoveredSubject && !(subject.keyName in entries)) {
                    entries[subject.keyName] = parser(subject.unique ? recoveredSubject[0] : recoveredSubject);
                }
            }
        });

        introspect(this._resolver, keyName, entries);

        return this;
    }

    fromTable(selector, keyName, subjectsMapper) {
        const mappedEntries = this._page(selector).toArray().map((item) => {
            const currentObject = {};
            Object.entries(subjectsMapper).forEach(([key, value]) => {
                currentObject[key] = getInnerText(this._page, value, item);
            });
            return currentObject;
        });
        introspect(this._resolver, keyName, mappedEntries);
        return this;
    }

    getObject() {
        return this._resolver;
    }
}

module.exports = AbstractParserBuilder;
