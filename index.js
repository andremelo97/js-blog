const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection.js");

// models
const Article = require("./articles/Article");
const Category = require("./categories/Category");

// routes
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

// view engine -> ejs
app.set('view engine', 'ejs');

// body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// static files
app.use(express.static('public'));

// database connection
connection
    .authenticate()
    .then(() => {
        console.log("Connection to the database established successfully.")
    })
    .catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'desc']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            });
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
});

app.listen(3035, () => {
    console.log("Server online");
});