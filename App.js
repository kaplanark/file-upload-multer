import express from "express";
import multer from "multer";
import flash from "connect-flash";
import session from "express-session";
import path from "path";

const upload = multer({ dest: "uploads/" });
const app = express();
const router = express.Router();
const __dirname = path.resolve();

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
  next();
});
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("photo"), function(req, res, next){
  if(req.file){
    req.flash("message", `${req.file.originalname}`);
    res.redirect("/");
  }else{
    req.flash("message", "choose a file");
    res.redirect("/");
  }
});

app.post("/uploads", upload.array("photos", 12), (req, res, next) => {
  if(req.fields){
    req.flash("message", `${req.fields}`);
    res.redirect("/");
  }else{
    req.flash("message", "choose a file");
    res.redirect("/");
  }
});

app.post(
  "/files",
  upload.fields([
    { name: "video", maxCount: 2 },
    { name: "photo", maxCount: 2 },
  ]),
  (req, res, next) => {
    if(req.file){
      req.flash("message", `${req.file.originalname}`);
      res.redirect("/");
    }else{
      req.flash("message", "choose a file");
      res.redirect("/");
    }
  }
);

app.listen(5000, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("App listen port 5000");
});
