import express from "express";
import multer from "multer";
import flash from "connect-flash";
import session from "express-session"
const upload = multer({ dest: "uploads/" });
const app = express();
const router = express.Router();

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
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    res.locals.message = req.flash('message');
    res.locals.info = req.flash('info');
    next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("photo"), (req, res, next) => {
  req.flash("message", `${req.file.originalname}`);
  res.redirect("/");
});

app.post("/uploads", upload.array("photos", 12), (req, res, next) => {
  res.redirect("/");
});

app.post(
  "/files",
  upload.fields([
    { name: "video", maxCount: 2 },
    { name: "photo", maxCount: 2 },
  ]),
  (req, res, next) => {
    res.redirect("/");
  }
);

app.listen(5000, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("App listen port 5000");
});
