const express = require("express");
const router = express.Router();


function Message(name, text) {
   this.name = name;
   this.text = text;
}

function Conversation(name1, name2) {
   this.name1 = name1;
   this.name2 = name2;
   this.content = [];

   let cont = this.content;
   this.addMess = function(name, text) {
      cont.push(new Message(name, text));
   }
}

var record = [];  // to store all the conversation record

function findConv(name1, name2) {
   for(let conv of record) {
      if((conv.name1 === name1 && conv.name2 === name2)
         || (conv.name1 === name2 && conv.name2 === name1)) 
         return conv;
   }
   record.push(new Conversation(name1, name2));
   return record[record.length-1];
}

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

module.exports = router;

