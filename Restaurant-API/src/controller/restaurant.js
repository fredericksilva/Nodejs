import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';  //create Restaurant class from the model

export default({ config, db }) => {
  let api = Router();

  // CRUD - Create Read Update Delete



  // 'v1/restaurant/add'
  api.post('/add', (req, res) => {
    let newRest = new Restaurant();   //createServer a new reataurant object from the 'Retaurant' class
    newRest.name = req.body.name;

    newRest.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Restaurant saved successfully' });
    });
  });

  // 'v1/restaurant' - Read
  api.get('/', (req, res) => {
    Restaurant.find({}, (err, restaurants) => {
      if (err) {
        res.send(err);
      }
      res.json(restaurants);    //return all restaurant in json format
    });
  });

  // '/v1/restaurant/:id' = Read 1
  api.get('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if(err) {
        res.send(err);
      }
      res.json(restaurant);
    });
  });

  // '/v1/restaurant/:id' - Update
  api.put('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      restaurant.name = req.body.name;
      restaurant.save(err => {
        if (err) {
          res.send(err)
        }
        res.json({ message: "Restaurant info updated"});
      });
    });
  });

  //'/v1/restaurant/:id' - Delete
  api.delete('/:id', (req, res) => {
    Restaurant.remove({
      _id: req.params.id
    }, (err, restaurant) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Restaurant successfully Removed"})
    });
  });

  return api;
}
