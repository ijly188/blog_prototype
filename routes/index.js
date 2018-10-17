var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

//  set the router match the view folder
router.get('/post', function(req, res, next) {
  res.render('post', { title: 'post' })
})

router.get('/dashboard/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'archives' })
})
router.get('/dashboard/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'article' })
})
router.get('/dashboard/categories', function(req, res, next) {
  res.render('dashboard/categories', { title: 'categories' })
})
router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'signup' })
})

module.exports = router;
