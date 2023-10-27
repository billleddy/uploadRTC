// Deployment notes:
// open the port: 
//     sudo firewall-cmd --list-all
//     sudo firewall-cmd --zone=public --permanent --add-port 3001/tcp
//     sudo firewall-cmd --reload
//     firewall-cmd --list-all
//
// Change the listening to httpS at the end
//
// run : node index.js

var express = require("express");
var app = express();
const os = require("os");
var cors = require("cors");
const fs = require("fs");
var https = require("https");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// ...
var destRoot = "./results/";  // root destination for all data

const multer  = require('multer');
const upload = multer({ dest: "./results/" });  // os.tmpdir()

app.post('/up', upload.single("streamfile"), function(req, res) {
  console.log("req.file= '", req.file, "'");

  // move the file from req.file.path to req.file.originalname . webm
  var newPath = destRoot + req.file.originalname + ".webm";
  fs.rename(req.file.path, newPath, function (err) {
    if (err) console.log("rename error=", err);    // throw err
    console.log("Successfully renamed to: ",  newPath);
  })

  res.sendStatus(200);
});

app.post('/gamedata', upload.single("streamfile"), function(req, res) {
  console.log("req.file= '", req.file, "'");

  // move the file from req.file.path to req.file.originalname . webm
  var newPath = destRoot + req.file.originalname;
  fs.rename(req.file.path, newPath, function (err) {
    if (err) console.log("rename error=", err);    // throw err
    console.log("Successfully renamed to: ",  newPath);
  })

  res.sendStatus(200);
});

app.post("/user", function(req, res) {
  const time = req.body.time;
  const email = req.body.email;
  const guid = req.body.guid;
  var userRecord = time + "," + email + "," + guid + "\n";

  console.log("user = ", userRecord);
  const fs = require('fs').promises;
  try {
      fs.appendFile(destRoot + "users", userRecord); 
  } catch (error) {
      console.log(error);
  }

  res.send({
    'email': email,
  });
});

app.post("/contact", function(req, res) {
  const email = req.body.email;
  const subject = req.body.subject;
  const comment = req.body.comment;
  const now = Date();
  
  var contactRecord = 
    "========================\n" +
      now.toLocaleString('en-US', { timeZone: 'UTC' }) + "UTC\n" +
      subject + "\n" +
      email + "\n" +
      comment + "\n" +
    "========================\n";

  const fs = require('fs').promises;
  try {
      fs.appendFile(destRoot + "contact", contactRecord); 
  } catch (error) {
      console.log(error);
  }

  res.send({
    'email': email,
  });
});

app.post("/abuse", function(req, res) {
  const game = req.body.game;
  const from = req.body.from;
  const now = Date();
  
  var abuseRecord = 
    "========================\n" +
      now.toLocaleString('en-US', { timeZone: 'UTC' }) + "UTC\n" +
      "game:" + game + "\n" +
      "from:" + from + "\n" +
    "========================\n";
  // console.log("abuseRecord=", abuseRecord);

  const fs = require('fs').promises;
  try {
      fs.appendFile(destRoot + "abuse", abuseRecord); 
  } catch (error) {
      console.log(error);
  }

  res.send({
    'game': game,
  });
});

app.get("/", (request, response) => {
  response.send("Hi there");
});

// for deployment
/*
var privateKey  = fs.readFileSync('../service/sslcert/outliar_net.key', 'utf8');
var certificate = fs.readFileSync('../service/sslcert/outliar_net.crt', 'utf8');


var credentials = {key: privateKey, cert: certificate};
var server = https.createServer(credentials, app);
server.listen(3001, function () {
  console.log('CORS-enabled web server listening on port https 3001')
});
*/

/* local testing */
app.listen(3001, () => {
 console.log("Listen on the port 3001...");
});



// module.exports = router;