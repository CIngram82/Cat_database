const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Cat = require('./models/cats')
const bodyParser = require('body-parser');

const express = require('express');
const server = express();
const mustache = require('mustache-express');
const session = require('express-session');

server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');
server.use(session({
  secret: 'I see a little',
  resave: false,
  saveUninitialized: true,
}));
server.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/test');

server.listen(30000, function() {
  console.log("The cats are purring!");
});

server.get('/', function(req, res) {
  res.redirect('/displayMe');
});


server.get('/displayMe', function(req, res) {

  Cat.find()
    .then(function (catList) {
      console.log(catList);
      res.render('display',{
        catList: catList
      });
      return;
  })
  .catch(function(){
      console.log("error geting Cats.find()");
      res.render('display')
      return;
    });
});

server.post('/addCat', function(req, res) {
  let cat = new Cat({name: req.body.catName});
  cat.weight = (req.body.catWeight);
  cat.age = (req.body.catAge);
  cat.eyeColor = (req.body.catEyeColor);
  cat.furColor = (req.body.catFurColor);
  cat.save()
  .then(function () {
    console.log("test")
    res.redirect('/displayMe');
    return; // why is this not kicking me out? Should it be break?
  })
  .catch(function () {
    //Keep getting this error but it is still doing cat.save.
    console.log('error saving cat.')
    res.redirect('/displayMe');
    return;
  })
  res.redirect('/displayMe');
});

server.post('/deleteCat/:id', function(req, res) {
  console.log(req.params.id);
  Cat.deleteOne({ name: req.params.id })
  .then(function () {
    res.redirect('/displayMe');
  });
})
