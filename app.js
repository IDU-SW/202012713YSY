const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'Secret Key'})
 ); 


const bookRouter = require('./router/book_router');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(bookRouter);
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
app.post('/login', handleLogin);
app.delete('/logout',handleLogout);

const user = {
    id : 'iu',
    password : '1234',
    name : 'IU',
    instagram : 'https://www.instagram.com/dlwlrma'
 }

 
function handleLogin(req, res) {
    const id = req.body.id;
    const password = req.body.password;
 
    if ( id === user.id && password === user.password ) {
       // 로그인 성공시 : 세션에 사용자 ID 저장
       req.session.userid = id;
       res.sendStatus(200);
    }
    else {
       res.sendStatus(401);
    }
 }
 
 function handleLogout(req, res) {
    req.session.destroy( err => {
       if ( err ) {
          res.sendStatus(500);
       }
       else {
          // 로그아웃 성공
          res.sendStatus(200);
       }
    });
 }
 

module.exports = app;

