const express = require('express')
const db = require('../models')
const router = express.Router()
const cryptojs = require('crypto-js')
require('dotenv').config()
const bcrypt = require('bcrypt');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


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
    try{
        db.message.findAll({
            where: {chatId: req.params.id},
            order: [
                ['createdAt', 'ASC'],
            ]
        })
        .then(messages =>{
            res.send({messages: messages, chatId: req.params.id, userId: res.locals.user.id});
        })
    }catch(err){
        // console.log('err1',err)
    }
    
})

router.post('/:id/messages', (req,res)=>{
    console.log("hi from post", req);
    try{
        db.message.create({
            chatId: req.params.id,
            senderId: res.locals.user.id,
            content: req.body.message,
        })
        .then(response =>{
            res.send(response)
            // console.log('response', response);
        })
    }catch(err){
        console.log('err1',err)

    }
   
})


router.post('/:senderId/:receiverId', (req, res)=>{
    let sender = req.params.senderId;
    let reciever = req.params.receiverId;
    db.chat.findOrCreate({
        where: {
          [Op.and]:[
            {
              toUser: {
                [Op.or]: [sender, reciever]
              },
            },
            {
              fromUser:{
                [Op.or]: [sender,reciever]
              }
            }
          ]
        },
        defaults: { toUser: reciever, fromUser:sender },
      }).then(([chat, created]) => {
            try{
                db.chat.findOne({
                    include : [{
                        model: db.user,
                        as: 'reciever',
                        where: {id: chat.dataValues.toUser}
                    }],
                    where:{
                        id: chat.dataValues.id
                    }
                }).then(chat=> {
                    res.send({chat: chat, created: created})
                })
            } catch(err){
                console.log(err)
            }         
            // console.log('chatContent', chat)
            // res.redirect(`chats/${chat.dataValues.id}`);
            // res.json(chat)
            // axios.get(`chat/${chat.id}`)
            // .then(response =>{
            //     console.log('hi')
            // })
    })
})


module.exports = router