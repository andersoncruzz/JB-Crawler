const router = require('express').Router({mergeParams: true});
const controller = require('./scrapper.controller')

router.get('/inquiry/:process_id', controller.find);

module.exports = router;
