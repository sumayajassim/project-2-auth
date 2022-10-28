const express = require('express')
const db = require('../models')
const router = express.Router()
const cryptojs = require('crypto-js')
require('dotenv').config()
const bcrypt = require('bcrypt');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;



// router.get('/:senderId/:receiverId', (req, res)=>{
//     let sender = req.params.senderId;
//     let reciever = req.params.receiverId;
//     db.chat.findOrCreate({
//         where: {
//           [Op.and]:[
//             {
//               toUser: {
//                 [Op.or]: [sender, reciever]
//               },
//             },
//             {
//               fromUser:{
//                 [Op.or]: [sender,reciever]
//               }
//             }
//           ]
//         }
//       }).then(([chat, created]) => {
//         if(!created){
//             console.log('the chat is exist')
//         }else{
//             axios.get(`chat/${chat.id}`)
//             .then(response =>{
//                 console.log('hi')
//             })
//         }
//     })
// })

router.get('/', (req,res)=>{
    db.user.findAll({
        where: {
            email: { [Op.like]: `%${req.query.search}%` },
          },
    }).then(response=>{
        // res.render('home', {searchResult: response.data});
        res.send(response)
    })
})

router.get('/:id', (req,res)=>{
    db.user.findAll({
        where: {
            chatId: req.params.id
          },
    }).then(response=>{
        // res.render('home', {searchResult: response.data});
        res.send(response)
    })
})

router.get('/:id/messages', (req,res)=>{
    db.message.findAll({
        where: {chatId: req.params.id},
        order: [
            ['createdAt', 'ASC'],
        ]
    })
    .then(messages =>{
        res.send({messages: messages, chatId: req.params.id, userId: res.locals.user.id});
    })
})

router.post('/:id/messages', (req,res)=>{
    console.log("hi from post", req);
    db.message.create({
        chatId: req.params.id,
        senderId: res.locals.user.id,
        content: req.body.message,
    })
    .then(response =>{
        res.send(response)
        // console.log('response', response);
    })
})


module.exports = router