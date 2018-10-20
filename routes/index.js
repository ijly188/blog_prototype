var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../connections/firebase_admin')

// test to connect the string 'any' in firebase
// const ref = firebaseAdmin.ref('any')
// ref.once('value',function(snapshot){
//   console.log(snapshot.val())
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

//  set the router match the view folder
router.get('/post', function(req, res, next) {
  res.render('post', { title: 'post' })
})

router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'signup' })
})

module.exports = router;
