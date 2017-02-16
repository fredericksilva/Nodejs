import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';  //create Restaurant class from the model

export default({ config, db }) => {
  let api = Router();

  // 'v1/restaurant/add'
  api.post('/add', (req, res) => {
    let newRest = new Restaurant();   //createServer a new reataurant object from the 'Retaurant' class
    newRest.name = req.body.name;

    newRest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Reataurant saved successfully' });
    });
  });

  return api;
}
