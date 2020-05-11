const fs = require('fs');
const mysql = require('mysql2');

const dbConfig = {
   host: 'localhost',
   user: 'dev',
   password: '4448',
   port: 3306,
   database: 'example',
   multipleStatements: true
};

const conn = mysql.createConnection(dbConfig).promise();

class Book {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getBookList(callback) {
        /*if (this.data) {
            return this.data;
        }
        else {
            return [];
        }*/
        console.log('connected as id ');  
        const sql = 'SELECT * FROM books';
        conn.query(sql).then(results => {
            for (const row of results) {            
                console.log(row);
            }
            conn.end();
        }).catch( err => {
            console.error('Error :', err);
            conn.end();
        }); 
        
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
        /*return new Promise((resolve, reject) => {
            for (var book of this.data ) {
                if ( book.id == bookId ) {
                    resolve(book);
                    return;
                }
            }
            reject({msg:'Can not find book', code:404});
        });*/
        const sql = 'SELECT * FROM books WHERE id = ?';
        conn.query(sql, bookId).then(results => {
            for (const row of results) {            
                console.log(row);
            }
            conn.end();
        }).catch( err => {
            console.error('Error :', err);
            conn.end();
        });  
    }

    deleteBook(bookId){
        const sql = 'DELETE FROM books WHERE id = ?';        
        // 파라미터가 1개면 배열 형식이 아니어도 된다.
        conn.query(sql, bookId).then(results => {
            console.log('DELETE Success');

            // console.log(results);
            const info = results[0];
            console.log('삭제된 Row(affectedRows) :', info['affectedRows']);

            conn.end();
        }).catch( err => {
            console.error('deleteMovie 실패 :', err);
            conn.end();
        });    
    }
}

module.exports = new Book();