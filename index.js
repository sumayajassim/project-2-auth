const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')

// MIDDLEWARE
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({extended: false}))

// CONTROLLERS
app.use('/users', require('./controllers/users'))

// ROUTES
app.get('/', (req, res)=>{
    res.render('home')
})

app.listen(8000, ()=>{
    console.log('Project 2 Express Authentication')
})