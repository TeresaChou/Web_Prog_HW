const express = require("express");
const router = require("./router");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);
app.use(cors());


io.on("connection", client => {
   console.log("user connected.");

   socket.on("disconnect", () => {
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
