const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('./models')

// MIDDLEWARE
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

// AUTHENTICATION MIDDLEWARE
app.use(async (req, res, next)=>{
    if(req.cookies.userId) {
        const user = await db.user.findByPk(req.cookies.userId)
        res.locals.user = user
    } else res.locals.user = null
    next()
})

// CONTROLLERS
app.use('/users', require('./controllers/users'))

// ROUTES
app.get('/', (req, res)=>{
    res.render('home')
})

app.listen(8000, ()=>{
    console.log('Project 2 Express Authentication')
})