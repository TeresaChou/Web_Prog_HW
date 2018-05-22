const express = require("express");
const router = express.Router();


/*
router.get('/', function(req, res) {
   res.status(200).send('Hello');
});

router.get('/:name1/:name2', function(req, res) {
   res.status(200).json(findConv(req.params.name1, req.params.name2));
});

router.post('/:name1/:name2', function(req, res) {
   console.log(req);
   let conv = findConv(req.params.name1, req.params.name2);
   conv.addMess(req.body.name, req.body.text);
   res.status(200).json(conv);
});
*/

module.exports = router;

