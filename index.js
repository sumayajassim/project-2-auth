const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const db = require('./models');
const cryptoJS = require('crypto-js');
require('dotenv').config();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const axios = require("axios");
const bodyParser = require('body-parser');


app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.json());

// AUTHENTICATION MIDDLEWARE
app.use(async (req, res, next)=>{
    if(req.cookies.userId) {
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET)
        const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8)
        const user = await db.user.findByPk(decryptedIdString)
        res.locals.user = user;
    } else res.locals.user = null
    next()
})

// CONTROLLERS
app.use('/users', require('./controllers/users'))
app.use('/chats', require('./controllers/chats'))


// ROUTES
app.get('/', (req, res)=>{
    if(res.locals.user){
        console.log('userID', res.locals.user.id)
        try{
            db.chat.findAll({
                include:[
                    {
                        model: db.user,
                        as: 'reciever',
                        required: false,
                        where: {id:{[Op.ne]:res.locals.user.id}}
                    },
                    {
                        model: db.user,
                        as: 'sender',
                        required: false,
                        where: {id:{[Op.ne]:res.locals.user.id}}

                    }
                    
                ],
                where: {
                // id: res.locals.user.id,
                  [Op.or]:[
                    {
                        fromUser: res.locals.user.id,
                    },
                    {
                        toUser: res.locals.user.id,
                    },
                  ]
                  }  
              })
            .then(chats =>{
                let chats1 = chats

            //    chats1 =chats1.forEach(chat=>{
            //         if(typeof chat.sender != undefined){
            //             // chat = chat.map((t)=>{
            //             //     return
            //             // })
            //             chat.receiver = {};
            //             chat.receiver = chat.sender;
            //         }
            //         delete chat['sender'];
            //     })

                // chats1.map((i)=>{
                //     i.receiver = 1;
                // })
                // chats_ = obj.transaction.map((t) => {
                //     return Object.assign({
                //       "PAPPS286": t.PAPPS286,
                //       "Nachname": t.Nachname,
                //       "PADPS60": t.PADPS60,
                //       "MH": {
                //         "name": t.SurveyResults[0].result.name,
                //         "email": t.SurveyResults[0].result.email,
                //         "birthdate": t.SurveyResults[0].result.birthdate
                //       }
                //     })
                //   })
                  
                // // res.send(chats);
                // console.log('typof',chats_.sender );
                // if(typeof chats_.sender != undefined ){
                //     // chats[0].user = chats[0].sender;
                //     // Object.assign(chats[0]['reciever'], chats[0]['sender']);
                //    delete chats_.sender;
                //     console.log('heeeeeelllo', chats_);
                // chats_.test = " Sumaya"

                // }else{
                    // chats_.test = "hello Sumaya"
                //     delete chats_.sender;
                //     chats_.user = {name: "Sumaya"}

                // // res.send(chats);

                // }// Returns true

                // res.send(chats1);

                res.render('home', {searchResults: [], chats: chats})
            })
        }catch(err){
            console.log(err);
        }
        
    }else{
        res.render("users/login")
    }
})

io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        console.log('message',data.msg );
        console.log('chatId',data.chatId );
        console.log('senderId',data.senderId );
        io.emit('chat message', data);
    });
});

server.listen(3000, ()=>{
    console.log('Project 2 Express Authentication')
})

