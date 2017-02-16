import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializedDb from '../db';

let router = express();

//connect to db
initializedDb(db => {

  //internal middleware
  router.use(middleware({ config, db}));

  //api routes v1(/v1)

});

export default router;
