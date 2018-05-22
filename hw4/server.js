const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


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

app.get('/:name1/:name2', function(req, res) {
   res.status(200).json(findConv(req.params.name1, req.params.name2));
});

io.on("connection", client => {
   console.log("user connected.");

   client.on("addMessage", (from, to, text) => {
      console.log("a message added to server");
      let conv = findConv(from, to);
      conv.addMess(from, text);
      io.emit("addMessage", from, to, text);
      console.log("a message sent to the client");
   });

   client.on("disconnect", () => {
      console.log("user disconnected.");
   });
});

var port = 3001;
http.listen(port, () => console.log("Listening on port", port));


//
// var users = [];
// app.get("/users", function(req, res) {
//    res.json(users);
// });
// 
// app.post('/users', function (req, res) {
//      users.push(req.body);
//      res.status(200).send('ok');
// });
// 
// app.put('/users/:name', function(req, res) {
//    const index = users.findIndex( user =>  user.name === req.params.name );
//    users[index] = req.body;
//    if(index > -1) {
//       res.status(200).send("ok");
//    }
// });
// 
// app.delete("/users/:name", function(req, res) {
//    users = users.filter( user => user.name !== req.params.name );
//    res.status(200).send("ok");
// });
