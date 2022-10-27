const express = require('express')
const db = require('../models')
const router = express.Router()
const cryptojs = require('crypto-js')
require('dotenv').config()
const bcrypt = require('bcrypt');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get('/new', (req, res)=>{
    res.render('users/new.ejs')
})

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
        where: {chatId: req.params.id}
    })
    .then(messages =>{
        res.send({messages: messages, chatId: req.params.id});
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