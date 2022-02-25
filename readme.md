# PEN Auth Boilerplate

## Overview: Authentication and Authorization
Authentication is determining if a user is who they say they are. A public field like email is not enough to make this determination, and this is why we have passwords. Only the _authentic_ owner of that email will know the password. That's why the process of verifying user credentials is called authentication.

Authorization is a separate process, and it can only happen after authentication. Once we've determined that a user is who they claim to be, we may want to check if they have permission to take a specific action. For example, the customers of our site may not have the same permissions as an admin. We are checking if the (already-authenticated) user is _authorized_ to take an action, which is why this is called authorization.

Today we will only be implementing authentication, but it's important to know that these are two separate processes.

## Part 0: Scaffolding the app
Set up a new node/express app for your project 2
1. Make a new directory for your project 2 app
2. Initialize node and git
3. Create a `.gitignore` that ignores `node_modules` and `.env`
4. Create a `readme.md`, a `.env`, and an entry point file (`index.js`)
5. install `express`, `ejs`, `express-ejs-layouts`, and `dotenv`.
6. Set up your express route to successfully render a home view


## Part 0.5 Get your database ready

1. Install `pg` and `sequelize`
2. Initialize sequelize
3. Create a database for this app `createdb express-auth-boilerplate`
4. Edit the`config.json` as needed

## Part 1: Creating a user
Creating a user is what happens when you sign up on a site. In many ways, it is exactly like creating any other CRUDable resource: you submit a form, it `POST`s to a `/users` endpoint, and we INSERT INTO the users table.

1. Use sequelize to create a users table. It should have the columns of email and password.
```
sequelize model:create --name user --attributes email:string,passwo
rd:string
```
2. Migrate! `sequelize db:migrate`
3. Create a users controller to hold all these user-related routes, as well as a users subfolder within views.
4. Create a route `GET /users/new` that serves up the form to create a new user. Put a link to this route in a nav bar inside layout.ejs.
5. Create a route `POST /users` that creates a new user, then redirects to the home route (don't forget the body-parser middleware).
6. Submit this form, and use psql to confirm that the user got created.

After these steps are in place, we will take an extra step that we haven't taken before: we will store this user's id in a _cookie_. This sends the user's id to the client's browser, which holds onto it, and sends it along with all subsequent requests within this domain.

Inside the create user route, let's set the cookie with `res.cookie('userId', <the user's id>)`. Then, let's look at the cookie in our browser. It's important to note that you can clear the cookie manually from the browser: we'll have to do this by hand until we build the logout system.

## Part 2: Logging in
In this section we will build some new routes:

1. `GET /users/login`: this serves up a login form. It should be very much like the form to create a new user, but it should POST to `/users/login` instead of `/users`. Put a link to this route in a nav bar inside layout.ejs.
1. `POST /users/login`: this receives the login form. It looks up a user based on email, and then it checks if the looked-up-user's password matches the password from the form. If they match, it sets the userId cookie just like when we created a user, then redirects to the root. If they don't match, it re-renders the login form, ideally with an error message.
1. `GET /users/logout`: this clears out the cookie with , then renders the homepage.

## Part 3: Loading the user on each request
On subsequent requests, we want to look up the user from the userId cookie. The first step is to install a cookie parser: `npm i cookie-parser`, then in the middleware section of your server.js:
```js
const cookieParser = require('cookie-parser')
app.use(cookieParser())
```
This will give you access to `req.cookies`, which will contain the cookie we issued in the previous steps.

On to actually looking up the user! We could do it manually inside of every route that needs knowledge of who's logged in:
```js
app.get('/someNewRoute', async (req, res) => {
  const user = await models.user.findByPk(req.cookies.userId)
  // the rest of the route
})
```
But this will get repetitive fast. Instead, we are going to `app.use` a function that looks up the user on every request. This goes in server.js as part of our middleware section:
```js
// AUTHENTICATION MIDDLEWARE
app.use(async (req, res, next)=>{
    const user = await db.user.findByPk(req.cookies.userId)
    res.locals.user = user
    next()
})
```

Let's take a minute to digest what's going on here:

1. This just looks up the user based on the userId that's coming in from the cookie.
1. `res.locals` is a property of the res object that starts off as an empty object on every request. We can write stuff into this object, and in downstream functions we can access it as `res.locals.whatever`. res.locals has another magic property: anything stored there is automatically available in all our views. So we can just start referring to `user` in our views.
1. If we don't invoke `next`, express doesn't know that it should keep the server.js relay race going.

We can test this out by logging res.locals in any route, and by referring to user in a view file.

We should wrap parts 1 and 2 in an `if (req.cookies.userId)`, so that if no one is logged in, we don't try to look up a user with an id of undefined. What should we set the res.locals.user to if there was no req.cookies.userId?

## Part 4: Doing something with the logged in user
Let's do two things with this logged in user:
1. Modify our nav bar: if there is a logged in user, display 2 links: Log Out and Profile (explained below). If there is no logged in user, display Log In and Sign Up links.
1. Create a `GET /users/profile` route: If there is a logged in user, it should render a view file that just says "Hello, {user's email}!" (the world's simplest profile). If there is no logged in user, it should redirect them to the login page.

## Part 5: Security
### Part 5a: encrypting our cookies
Right now, there's nothing to stop someone from manually changing their userId cookie in their browser, effectively impersonating another user. To change that, we are going to encrypt the user id value using a secret string before we send it out in the cookie. And when it comes back on subsequent requests, we are going to decrypt it using the same secret string. Because no one else knows our secret string, no one can craft a cookie to impersonate another user.

1. We'll use [CryptoJS](https://www.npmjs.com/package/crypto-js) to encrypt the user id via the Advanced Encryption Standard (AES). If you'd like to learn more about AES and related encryption algorithms, Computerphile has several videos about them. Here's a few to start with:
    * [One encryptions standard to rule them all](https://youtu.be/VYech-c5Dic)
    * [Almost all web encryption works like this](https://youtu.be/DLjzI5dX8jc)
[CryptoJS](https://www.npmjs.com/package/crypto-js) has methods for encrypting and decrypting via AES, so we'll use it in our app.
 `npm i crypto-js`
2. We need to encrypt the user id _before_ we attach it to the cookie. Not that we assign the user id to the cookie in 2 places, but both of them are inside the user controller, so we'll import the package there.
 `const cryptojs = require('crypto-js')`
3. 
4. Instead of `res.cookie('userId', user.id)`, we want:
```js
    const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
    const encryptedUserIdString = encryptedUserId.toString()
    res.cookie('userId', encryptedUserIdString)
```
5. We also need to decrypt cookies as they come in the door (in the authentication middleware we wrote):
```js
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET)
        const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8)
        const user = await db.user.findByPk(decryptedIdString)
```
1. We shouldn't actually have our super secret string in our code! If we commit it to github, anyone can look at it and use it to craft cookies. Instead, we should put it into a .env file to keep it secret. This works just like when we put our api keys into a .env file.

### Part 5b: hashing our passwords
Hashing is the process of convering a string into an obfuscated string. There is a key difference between hashing and encrypting: something that's been encrypted can be decrypted if you have the secret string. But something that's been hashed can _never_ be recovered into its original string. For this reason we say that hashing is _one-way_. It is mathematically impossible to reverse engineer a hashed string to it's original string. The only only way for a hacker to guess a hashed password is by brute force (aka trial and error).

The key with hashing is this: The same string will produce the same hash when run through the same hashing algorithm. That means that we can hash a user's password when they sign up and store the hash in the database. Then everytime they login, we'll hash the password they entered and compare that to the hash in the db.

We'll use the [bcrypt](https://www.npmjs.com/package/bcryptjs) package to hash the passwords in our app.
0. `npm i bcrypt`
1. Modify the signup route to hash the password before saving it in the db (you'll need to import it to use it):
```js
const hashedPassword = bcrypt.hashSync('the incoming password', 10)
```
3. When a user attempts to login, we will hash the password they are attempting to log in with. Then we compare the hashed version of the incoming password to the one we saved in the db when the user was created. bcrypt comes with a built in function to help us with this.
```js
// replace 
else if (user.password !== req.body.password)
// with 
else if (!bcrypt.compareSync(req.body.password, user.password))
```

Hashing our passwords is a countermeasure in case anyone ever gains access to our db. If our users' plaintext passwords were in there, the breacher could log in as all our users and take any action (withdraw all their money, post harmful content, etc). But if all the breacher has is emails and hashed passwords, they can't log in as our users.

Ok, so let's say that a breacher has our users' emails and hashed passwords. They could use brute force and compare every possible string to the hashed password until they get a match, and then they would know the user's password. For this reason, bcrypt is intentionally designed to take a long time to run (~500ms). Of course, the user will experience this delay when they log into the site, but it's not much time when you just experience it once. But someone trying to brute force every possible string will experience this delay millions of times, making it very expensive to do.

As engineers of the world develop faster and faster computers, a task that takes 500ms today might only take 50ms in the future. So, bcrypt allows you to specify a _cost factor_. When we say `bcrypt.hashSync(req.body.password, 10)`, the 10 means that bcrypt must hash the password, then hash the result of that, then hash the result of that, and so on, 2^10 (1,024) times. It is possible to crank up the cost factor, which will double the amount of time it takes to hash.

Ok, let's say I'm a next-level breacher: I know that brute force guessing passwords takes a long time. But I also know that I can find a list of the 1000 most commonly used passwords. And I can hash them all ahead of time, so that when I am trying to guess hashed passwords, I can just compare them to my pre-hashed list. This pre-hashed list is called a _rainbow table_, and it makes it much more feasible to crack hashed passwords. Rainbow tables are no secret and are widely published, but security engineers have found a defense against them.

Every time bcrypt hashes a password, it first concatenates a _salt_ onto the end. A salt is a randomly generated string that gets saved with the hashed password in the database:
```
$2b$10$eKH9xXBxnEVhruGsUoDE2.PCSvwGHBf7cgkPqsXGia/O03NHNI212
 ^  ^                       ^                 ^
 |  |                       |                 |
 | cost factor              |         this last chunk is the actual hash
 |          everything from the $ to here is salt
version of bcrypt  
```
The purpose of a salt is: let's say that the user made a dumb password like 'Password1234'. This will probably appear in most rainbow tables. But 'Password1234eKH9xXBxnEVhruGsUoDE2.' certainly will not. This post explains the salting process well: https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts

## Part 6: Prevent duplicate users

Change the signup route to use a `findOrCreate` that searches by the email.
If the user wasn't created, render the login page and send an appropriate error message to display.
If the user was created, proceed with hashing the password and assigning it to the user object in the db.

```js
router.post('/', async (req, res)=>{
    const [newUser, created] = await db.user.findOrCreate({where:{email: req.body.email}})
    if(!created){
        console.log('user already exists')
        res.render('users/login.ejs', {error: 'Looks like you already have an account! Try logging in :)'})
    } else {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        newUser.password = hashedPassword
        await newUser.save()
        const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        res.cookie('userId', encryptedUserIdString)
        res.redirect('/')
    }
})
```