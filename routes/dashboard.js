var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../connections/firebase_admin')

// ref means reference
const categoriesRef = firebaseAdmin.ref('/categories/')

router.get('/archives', function(req, res, next) {
    res.render('dashboard/archives', { title: 'archives' })
})
router.get('/article', function(req, res, next) {
    res.render('dashboard/article', { title: 'article' })
})
router.get('/categories', function(req, res, next) {
    res.render('dashboard/categories', { title: 'categories' })
})

router.post('/categories/create', function(req, res){
    const data = req.body
    // console.log(data)

    // only one category id == unique id
    // categories -> many defferent "category" in it
    const categoryRef = categoriesRef.push()
    const key = categoryRef.key
    data.id = key
    categoryRef.set(data).then(function(success){
        res.redirect('/dashboard/categories')
    }).catch(function(error){
        console.log(error)
        res.redirect('/')
    })
})

module.exports = router;