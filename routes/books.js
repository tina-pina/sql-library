let express = require('express');
let router = express.Router();
const sequelize = require('sequelize');
let Book = require("../models").Book;


/* GET /books - Shows the full list of books */
router.get('/', function (req, res, next) {
    Book.findAll({}).then(function (books) {
        res.render('books/index', {
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

    Book.create(req.body)
        .then(() => {
            return res.redirect('/books/');
        })
        .catch(sequelize.ValidationError, function (err) {
            let msg = "OOOOPSSSS!"
            let is_title_missing = (!req.body.title) ? true : false;
            let is_author_missing = (!req.body.author) ? true : false;

            res.render('books/new-book', {
                book: req.body,
                title: "New Book",
                msg: msg,
                is_title_missing: is_title_missing,
                is_author_missing: is_author_missing,
            })
        })
});


/* GET /books/:id - Shows book detail form */
router.get('/:id', function (req, res, next) {
    Book.findOne({ where: { id: req.params.id } })
        .then(book => {
            if (!book) {
                let err = new Error("book does not exist")
                next(err)
            } else {
                res.render('books/update-book', { book: book, title: "Update Book", bookId: req.params.id })
            }
        })
});


/* POST /books/:id - Updates book info in the database */
router.post("/:id", function (req, res, next) {

    Book.findOne({ where: { id: req.params.id } })
        .then(book => {
            if (!book) {
                let err = new Error("book does not exist")
                next(err)
            } else {
                book.title = req.body.title;
                book.author = req.body.author;
                book.genre = req.body.genre;
                book.year = req.body.year;
                book.save()
                    .then(() => { return res.redirect("/books/") })
                    .catch(sequelize.ValidationError, function (err) {
                        let msg = "OOOOPSSSS!"
                        let is_title_missing = (!req.body.title) ? true : false;
                        let is_author_missing = (!req.body.author) ? true : false;

                        res.render('books/update-book', {
                            bookId: req.params.id,
                            book: req.body,
                            title: "Update Book",
                            msg: msg,
                            is_title_missing: is_title_missing,
                            is_author_missing: is_author_missing,
                        });
                    })
            }
        })
});


/* POST /books/:id/delete - Deletes a book => this can’t be undone */
router.post("/:id/delete", function (req, res, next) {
    Book.findOne({ where: { id: req.params.id } })
        .then(book => {
            if (!book) return res.redirect("/")
            else {
                book.destroy({ force: true })
                return res.redirect("/books/");
            }
        })
});


module.exports = router;