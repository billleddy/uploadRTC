var express = require("express");
const app = express();
const os = require("os");
var cors = require("cors");
const fs = require("fs");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ...

const multer  = require('multer');
const upload = multer({ dest: "/tmp" });  // os.tmpdir()
/*
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
    console.log(req.rawBody);
  }
}
*/
app.post('/up', upload.single("streamfile"), function(req, res) {
  console.log("req.file= '", req.file, "'");

  // move the file from req.file.path to req.file.originalname . webm
  var newPath = "/tmp/" + req.file.originalname + ".webm";
  fs.rename(req.file.path, newPath, function (err) {
    if (err) console.log("rename error=", err);    // throw err
    console.log("Successfully renamed to: ",  newPath);
  })

  res.sendStatus(200);
});

app.post('/api/users', function(req, res) {
  const user_id = req.body.id;
  const token = req.body.token;
  const geo = req.body.geo;

  res.send({
    'user_id': user_id,
    'token': token,
    'geo': geo
  });
});

app.get("/", (request, response) => {
  response.send("Hi there");
});

app.listen(3001, () => {
  console.log("Listen on the port 3001...");
});

// module.exports = router;