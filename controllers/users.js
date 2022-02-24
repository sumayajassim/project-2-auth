const express = require('express')
const db = require('../models')
const router = express.Router()

router.get('/new', (req, res)=>{
    res.render('users/new.ejs')
})

router.post('/', async (req, res)=>{
    const newUser = await db.user.create(req.body)
    res.cookie('userId', newUser.id)
    res.redirect('/')
})

module.exports = router