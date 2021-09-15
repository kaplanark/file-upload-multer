const express = require("express");
const multer = require("multer");
const flash = require("connect-flash");
const session = require("express-session");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const fs = require("fs");

const dbUrl = "mongodb://localhost:27017";
const app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

app.use(
  session({
    secret: "secret mesage",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("error");
  res.locals.message = req.flash("message");
  res.locals.info = req.flash("info");
  res.locals.warning = req.flash("warning");
  next();
});
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));

MongoClient.connect(dbUrl, (err, client) => {
  if (err) return console.log(err);
  db = client.db("admin");
  app.listen(3000, () => {
    console.log("Database listen port 3000");
  });
});

app.post("/upload", upload.single("file"), function (req, res, next) {
  if (!req.file) {
    req.flash("warning", "choose a file");
    res.redirect("/");
  } else {
    req.flash("message", `${req.file.originalname}`);
    res.redirect("/");
  }
});

app.post("/uploads", upload.array("files", 12), (req, res, next) => {
  if (!req.fields) {
    req.flash("warning", "choose a file");
    res.redirect("/");
  } else {
    req.flash("message", `${req.fields}`);
    res.redirect("/");
  }
});

app.post("/uploadphoto", upload.single("photo"), (req, res, next) => {
  if (!req.file) {
    req.flash("warning", "choose a file");
    res.redirect("/");
  } else {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString("base64");
    var finalImg = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_image, "base64"),
    };
    db.collection("galery").insertOne(finalImg, (err, result) => {
      console.log(result);
      if (err) return console.log(err);
      req.flash("message", `${req.file.originalname}` + " saved database");
      res.redirect("/");
    });
  }
});

app.get("/photos", (req, res) => {
  db.collection("galery")
    .find()
    .toArray((err, result) => {
      const imgArray = result.map((element) => element._id);
      console.log(imgArray);
      if (err) return console.log(err);
      res.send(imgArray);
    });
});
app.get("/photos/:id", (req, res) => {
  const id = req.params.id;
  db.collection("galery").findOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) return console.log(err);
    res.contentType("image/jpeg");
    res.send(result.image.buffer);
  });
});

app.get("/", (req, res) => {
  // db.collection("galery").find({} ,(err,found)=>{
  //   if(err){
  //     console.log(err);
  //   }else{
  //     res.render("index",{found:found});
  //   }
  // })
  // // const found = db.collection("galery").findOne({_id:ObjectId("6141f52a504f055004c521dc")});
  // // console.log(found);
  res.render("index");
});

app.listen(5000, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("App listen port 5000");
});
