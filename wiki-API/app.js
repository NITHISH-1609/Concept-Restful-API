//importing...
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const {
    send
} = require("process");



//initial stuffs
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));



//mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const articleSchema = {
    title: String,
    content: String
}
const article = mongoose.model("article", articleSchema);




//route- article
app.route("/articles")
    .get((req, res) => {
        article.find({}, (err, docs) => {
            if (!err)
                res.send(docs);
            else
                res.send(err);
        })
    })

    .post((req, res) => {
        const articlex = new article({
            title: req.body.title,
            content: req.body.content
        })
        articlex.save((err, docs) => {
            if (!err)
                console.log("No errors post added");
            else
                console.log("err");
        });
    })

    .delete((req, res) => {
        article.deleteMany({}, (err, docs) => {
            if (!err)
                res.send("sucessfully deleted");
            else
                console.log(err);
        })

    });


//route-custom
app.route("/articles/:custom")
    .get((req, res) => {
        const filename = req.params.custom;
        article.findOne({
            title: filename
        }, (err, docs) => {
            res.send(docs);
            console.log(docs);
        })
    })

    .put((req, res) => {
        article.updateOne({
            title: req.params.custom
        }, {
            title: req.body.title,
            content: req.body.content
        }, (err, docs) => {
            if (!err)
                res.send("updated sucessfully");
            else
                res.send(err);
        })

    })

    .patch((req, res) => {
        article.updateOne({
                title: req.params.custom
            }, {
                $set: req.body
            },
            (err, docs) => {
                if (!err) {
                    console.log(docs);
                    if (!docs.n == 0)
                        res.send("updated sucessfully");
                    else
                        res.send("docs not found!")
                } else
                    res.send(err);
            })

    })

    .delete((req, res) => {
        article.deleteOne({
            title: req.params.custom
        }, (err, docs) => {
            if (!err)
                if (!docs.n == 0)
                    res.send("Deleted Sucessfully");
                else
                    res.send("Not found");
            else
                res.send(err);
        })
    })








//port

app.listen(3000, function () {
    console.log("Server started on port 3000");
});