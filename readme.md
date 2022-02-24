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