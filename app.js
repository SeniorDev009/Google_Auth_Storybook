const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const connectDB = require('./config/db');
// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');
// Load config
dotenv.config({path: "./.env"});

// Passport config
require('./config/passport')(passport);

connectDB();



// initialize the app
const app =  express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,})
  }))
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')))
// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));