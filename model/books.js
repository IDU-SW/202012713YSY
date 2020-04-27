const fs = require('fs');


class Book {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getBookList() {
        if (this.data) {
            return this.data;
        }
        else {
            return [];
        }
    }

    addBook(title, director, year, synopsis) {
        return new Promise((resolve, reject) => {
            let last = this.data[this.data.length - 1];
            let id = last.id + 1;

            let newBook = {id:id, title:title, director:director, year:year, synopsis:synopsis};
            this.data.push(newBook);

            resolve(newBook);
        });
    }

    // Promise - Reject
    getBookDetail(bookId) {
        return new Promise((resolve, reject) => {
            for (var book of this.data ) {
                if ( book.id == bookId ) {
                    resolve(book);
                    return;
                }
            }
            reject({msg:'Can not find book', code:404});
        });
    }
}

module.exports = new Book();