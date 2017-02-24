import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializedDb from '../db';
import foodtruck from '../controller/foodtruck';
import account from '../controller/account';

let router = express();

//connect to db
initializedDb(db => {

  //internal middleware
  router.use(middleware({ config, db}));

  //api routes v1(/v1)
  router.use('/foodtruck', foodtruck({ config, db}));   //make the route use the db
  router.use('/account', account({ config, db}));

});

export default router;
