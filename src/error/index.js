const httpstatus = require('http-status');
module.exports = (err, req, res, next) => {
    const o = {
        code: err.code || httpstatus.INTERNAL_SERVER_ERROR,
        name: err.name,
        message: err.message || err,
    };
    res.status(o.code).json(o);
};
