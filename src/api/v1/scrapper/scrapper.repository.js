const {findStateFromTRCode} = require('../../../domain/courttype');

const find = (trCode) => findStateFromTRCode(trCode);

module.exports = {
    find,
}
