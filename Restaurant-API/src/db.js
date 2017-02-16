import mongoose from 'mongoose';
import config from './config';

export default callback => {
  let db = mongoose.connect(config.mongoUrl); //referencing the mongoUrl property of the default object in the config folder
  callback(db);         //passing db back to whereevr its being imported
}
