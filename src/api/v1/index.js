const router = require('express').Router({ mergeParams: true });
const scrapper = require('./scrapper');

router.use(scrapper);

module.exports = router;
