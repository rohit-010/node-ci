jest.setTimeout(340000);
const keys = require('../config/keys');
const mongoose = require('mongoose');
require('../models/User');


const setup = async() => {
  try{
    await mongoose.connect(keys.mongoURI);
    console.log('Setup js Connected to mongo db');
  }
  catch(err){
    console.error(err);
  }
}

// setup();

beforeAll(async () => {
  await setup();
});

afterAll(async() => {
  try{
    await mongoose.disconnect();
    console.log('Setup js DisConnected from mongo db');
  }
  catch(err){
    console.error(err);
  }
});