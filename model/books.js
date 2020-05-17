const fs = require('fs');
const mysql = require('mysql2');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('example', 'dev', '4448', {
    dialect: 'mysql', host: '127.0.0.1'
});

/*const dbConfig = {
   host: 'localhost',
   user: 'dev',
   password: '4448',
   port: 3306,
   database: 'example',
   multipleStatements: true
};
*/



//const conn = mysql.createConnection(dbConfig).promise();

class Books extends Sequelize.Model {}
Books.init({
    title: Sequelize.STRING,
    artist: {
        type: Sequelize.STRING,
        allowNull: true
    },
    price: {
        type: Sequelize.INTEGER,
        defaultValue: 0},
    synopsis: {
        type: Sequelize.STRING}
}, {sequelize});

Books.sync({force: false}).then( ret => {
    console.log('Sync Success :', ret);
}).catch(error => {
    console.error('Sync Failure :', error);
});

class Artist extends Sequelize.Model {}
Artist.init({
    age: Sequelize.INTEGER, 
    phone :Sequelize.STRING
}, {sequelize});
Artist.sync({force: false}).then( ret => {
    console.log('Sync Success :', ret);
}).catch(error => {
    console.error('Sync Failure :', error);
});


class Book {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.data = JSON.parse(data)
    }

    // Promise 예제
    getBookList(callback) {
        console.log('connected as id ');  
        Books.findAll({})
        .then( results => {
            for (var item of results) {
                console.log('id:', item.id, ' title:', item.title);
            }
        })
        .catch( error => {
            console.error('Error :', error);
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

//데이터 생성
async function addNewBooks() {
    const books = [
        { title:"데일 카네기 안간관계론", artist:"데일 카네기",price:11500,synopsis:"사람의 마음을 사로잡는 가장 빠르고 확실한 방법! 데일 카네기가 전하는 성공하는 인간관계의 비밀인간관계는 친구를 만들고 적을 만들지 않는 것에서 시작된다. 『데일 카네기 인간관계론』은 이런 인간관계의 핵심을 꿰뚫는다. ‘친구를 만들고, 사람을 설득하는 법’이라는 제목으로 1936년 처음 출간된 데일 카네기의 책은 80년 넘게 수많은 사람들에게 영향을 끼쳐 왔.."},
        { title:"녹나무의 파수꾼", artist:"하기시노 게이고",price:17800,synopsis:"사상 최초 한국·중국·일본·대만 전 세계 동시 출간! 《나미야 잡화점의 기적》"}
    ];

    const creates =  books.map( item => Books.create(item, {logging: false}) );
    Promise.all(creates)
    .then( ret => {
        const newAddIds = ret.map( result => result.dataValues.id );
        console.log('Create Success. new ids:', newAddIds);
    }).catch( err => {
        console.error('Create Failure :', err);
    });
}

async function doOneway1() {
    // 단방향
    Books.hasOne(Artist);

    try {
        await Books.sync({});
        await Artist.sync({});
        let books = await Books.create({title:"레드 퀀 : 적혈의 여왕 2", artist:"빅토리아 애비야드",price:13800,synopsis:"붉은색 피로 태어나며 평범한 "}, {log: false});
        let artist = await Artist.create({age:30, phone:'010-1111-1111'}, {log: false});

        console.log('Create Success');

        await Books.setArtist(artist);

        const ret = await Books.findAll({
            where: {phone: {[Op.eq]:'010-1111-1111'}},
            include: [{model: Artist}]
        });
        const findBooks = ret[0];

        console.log('find books :', findBooks.name);
        
        const findArtist = findBooks.Artist;
        console.log('Artist :', findArtist.age, findArtist.phone);
    }
    catch ( error ) {
        console.log('Error :', error);
    }
}


addNewBooks();
//doOneway1();
module.exports = new Book();