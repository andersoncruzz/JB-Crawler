const repository = require('./scrapper.repository');

async function find(req, res, next) {
    try {
        const result = await repository.find(req.params.process_id);
        return res.json(result);
    } catch (exception) {
        return next(exception);
    }
}

module.exports = {
    find,
}
