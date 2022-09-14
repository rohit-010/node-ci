const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./services/cache');

//mongoose.Promise = global.Promise;
console.log('keys.mongoURI:',keys.mongoURI);
const start = async() => {
  try{
    await mongoose.connect(keys.mongoURI);
    console.log('Connected to mongo db');
  }
  catch(err){
    console.error(err);
  }
}

start();
//mongoose.connect(keys.mongoURI, { useMongoClient: true });

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
 app.use(passport.initialize());
 app.use(passport.session());
app.use(passport.authenticate('session'));

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production','ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5100; 
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
