const express = require('express');
const router = express.Router();
const books = require('../model/books');

router.get('/books', showBookList);
router.get('/Books/:bookId', showBookDetail);
router.post('/books', addBook);
router.delete('/books/:bookId', deleteBook);


module.exports = router;

function showBookList(req, res) {
    const bookList = books.getBookList();
    const obj = {data:bookList, };
    res.send(obj);
}


// Async-await를 이용하기
async function showBookDetail(req, res) {
    try {
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.getBookDetail(bookId);
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}


// 새 영화 추가
// POST 요청 분석 -> 바디 파서
async function addBook(req, res) {
    const title = req.body.title;

    if (!title) {
        res.status(400).send({error:'title 누락'});
        return;
    }

    const director = req.body.director;
    const year = parseInt(req.body.year);
    const synopsis = req.body.synopsis;

    try {
        const result = await books.addBook(title, director, year, synopsis);
        res.send({msg:'success', data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}

async function deleteBook(req,res) {
    console.log('delete request');
    res.send({msg: 'Delete Request success'});
    try {
        const bookId = req.params.bookId;
        console.log('bookId : ', bookId);
        const info = await books.deleteBook(bookId);
        res.send(info);
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}
    