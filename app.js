const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect To Database
mongoose.connect(config.database);
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});
//-On Connection
// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});
//-On Error
//-Connect To Database

const app = express();
const port = process.env.port || 3000;

// Routes
const users = require('./routes/users');
const voluume = require('./routes/voluume');
//-Routes


// Middleware  
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); //Express public middleware
app.use(passport.initialize());
app.use(passport.session());
//-Middleware 
require('./config/passport')(passport);

// Routes Middleware
app.use('/users',users);
app.use('/voluume',voluume);
//-Routes Middleware

app.listen(port,(req,res)=>{
    console.log("Server running on port " + port);
});