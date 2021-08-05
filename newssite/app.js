// importing...
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const app = express();
var favicon = require('serve-favicon');
const path = require('path');



//stuffs...
// favicon...
app.use("/public", express.static('public')); 
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://Admin-Spark:NITHISHr1609@cluster01.ckyib.mongodb.net/newsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



// Schema-1
const newsSchema = new mongoose.Schema({
  title: String,
  body: String
});
const aboutSchema = new mongoose.Schema({
  title: String,
  body: String
});
const post = mongoose.model('post', newsSchema);
const abt = mongoose.model('abt', newsSchema);






//initial content of route
const initial = new post({
  title: " Hey, welcome to our news blog site! ",
  body: " You can write about anything your wish. Enjoy sharing your thoughts around the global. Hope you love our site. Keep supporting and Enjoy <3"
});





//abt schema declaration...
var variable = " I Code!";
var About = "About";
const aboutx = new abt({
  title: About,
  body: variable
});
var variable = "Hey you can contact me if You Know how to. All the Best!";
var Contact = "Contact"
const contactx = new abt({
  title: Contact,
  body: variable
});
const arr = [aboutx, contactx];







//Empty or not...
post.find({}, (err, docs) => {
  if (docs.length === 0) {
    initial.save();
    abt.insertMany(arr, (err, docs) => {
      if (err)
        console.log(err)
      else
        console.log("initial and Abt content added");
    })
  }

});










//home route...
app.get("/", (req, res) => {

  post.find({}, (err, docs) => {

    res.render("home", {

      postlist: docs
    })
  })

})


//posts to custom routes...

app.get("/posts/:id", (req, res) => {
  const number = req.params.id;
  post.find({
    _id: number
  }, (err, docs) => {
      res.render("post", {
        postlist:docs,
        title: docs[0].title,
        content: docs[0].body
      })
  })

})


// About and Contact...
app.get("/about", (req, res) => {
  abt.find({
    title: "About"
  }, (err, docs) => {
    res.render("about", {
      content: docs[0].body
    })
  })

})

app.get("/contact", (req, res) => {


  abt.find({
    title: "Contact"
  }, (err, docs) => {

    res.render("contact", {

      content: docs[0].body
    })
  })

})


//deleteing post routing...

app.post("/delete",(req,res)=>{

  post.findByIdAndRemove(req.body.button,(err,docs)=>{
    if(err)
    console.log(err)
    else
    console.log("removed the Post")
    res.redirect("/");
  })
})






//get and post of compose...
app.get("/compose", (req, res) => {
  res.render("compose")

})

app.post("/compose", (req, res) => {
  const postx = new post({
    title: req.body.posttitle,
    body: req.body.postbody
  });
  postx.save();
  res.redirect("/");
})












//port....
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});