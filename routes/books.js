let express = require('express');
let router = express.Router();
let dateFormat = require('dateformat');
let Book = require("../models").Book;

// var app = express();

// app.use(app.router);
// routes.initialize(app);


/* GET /books - Shows the full list of books */

router.get('/', function (req, res, next) {
    Book.findAll({}).then(function (books) {
        res.render('books/index', {
            // title: 'Sequelize: Express Example',
            // author: 'Arnold Schwarzexpress',
            books: books
        });
    });;
});


/* GET /books/new - Shows the create new book form */

router.get('/new', function (req, res, next) {
    res.render('books/new-book', { book: Book.build(), title: "New Book" });
});

/* POST /books/new-book - Posts a new book to the database */
router.post('/new', function (req, res, next) {

    /* Validation */
    if (!req.body.title || !req.body.author) {
        let msg = "OOOOPSSSS!"
        let is_title_missing = (!req.body.title) ? true : false;
        let is_author_missing = (!req.body.author) ? true : false;

        res.render('books/new-book', {
            book: req.body,
            title: "New Book",
            msg: msg,
            is_title_missing: is_title_missing,
            is_author_missing: is_author_missing,
        });
    }

    Book.create(req.body).then((error, book) => {
        res.redirect('/books/');
    });

});

/* GET /books/:id - Shows book detail form */
router.get('/:id', function (req, res, next) {
    Book.findOne({ where: { id: req.params.id } })
        .then(book => {
            if (!book) res.redirect("/")
            res.render('books/update-book', { book: book, title: "Update Book" })
        })
});

/* POST /books/:id - Updates book info in the database */
router.post("/:id", function (req, res, next) {

    /* Validation */
    if (!req.body.title || !req.body.author) {
        let msg = "OOOOPSSSS!"
        let is_title_missing = (!req.body.title) ? true : false;
        let is_author_missing = (!req.body.author) ? true : false;

        res.render('books/update-book', {
            book: req.body,
            title: "Update Book",
            msg: msg,
            is_title_missing: is_title_missing,
            is_author_missing: is_author_missing,
        });
    }

    Book.findOne({ where: { id: req.params.id } })
        .then(book => {
            if (!book) res.redirect("/")

            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.year = req.body.year;
            book.save()

            res.redirect("/books/");

        })
});

/* POST /books/:id/delete - Deletes a book => this can’t be undone */

router.post("/:id/delete", function (req, res, next) {
    Book.findOne({ where: { id: req.params.id } })
        .then(book => {
            if (!book) res.redirect("/")
            book.destroy({ force: true })
            res.redirect("/books/");
        })
});













module.exports = router;