var express = require("express");
const app = express();
const os = require("os");
var cors = require("cors");
const fs = require("fs");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ...
var destRoot = "/tmp/";  // root destination for all data

const multer  = require('multer');
const upload = multer({ dest: "/tmp" });  // os.tmpdir()

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
  const email = req.body.email;
  const guid = req.body.guid;
  var userRecord = email + "," + guid + "\n";

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

app.get("/", (request, response) => {
  response.send("Hi there");
});

app.listen(3001, () => {
  console.log("Listen on the port 3001...");
});

// module.exports = router;