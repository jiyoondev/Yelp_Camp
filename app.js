const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
//req.body undefined 설정을 parse할 수 있게 바꿈

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
});
//:id route를 new route 위에 써버리면 new를 id로 취급하므로 순서가 중요함

app.listen(3000, () => {
  console.log('serving on port 3000');
});
