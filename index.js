require("dotenv").config()

const express = require("express")
const session = require("express-session")
const passport = require("passport")

const strategy = require("./strategy")

const app = express()

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000
    }
  })
)

app.use(passport.initialize())
app.use(passport.session()) //this has to been done after session so that session exists
passport.use(strategy)

passport.serializeUser((user, done) => {
  //this creates the user object
  done(null, user)
})
passport.deserializeUser((user, done) => {
  //this attaches (exposes) the user object to req object
  done(null, user)
})

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/me",
    failureRedirect: "/login" //don't do this in production bc it will create a loop
  })
)

app.get("/me", (req, res) => {
  if (!req.user) {
    res.sendStatus(401)
  } else {
    res.status(200).send(req.user)
  }
})

const port = 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
