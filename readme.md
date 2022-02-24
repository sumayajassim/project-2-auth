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
