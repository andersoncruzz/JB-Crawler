const httpstatus = require('http-status');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _) => {
  const o = {
    'code': err.code || httpstatus.INTERNAL_SERVER_ERROR,
    'name': err.name,
    'message': err.message || err,
  };
  res.status(o.code).json(o);
};
