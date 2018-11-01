var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../connections/firebase_admin')
const stringtags = require('striptags')
const moment = require('moment')
const convertPagination = require('../modules/convertPagination')

// ref means reference
const categoriesRef = firebaseAdmin.ref('/categories/')
const articlesRef = firebaseAdmin.ref('/articles/')

// test to connect the string 'any' in firebase
// const ref = firebaseAdmin.ref('any')
// ref.once('value',function(snapshot){
//   console.log(snapshot.val())
// })

/* GET home page. */
router.get('/', function(req, res, next) {
    let currentPage = Number.parseInt(req.query.page) || 1
    let categories = {}
    categoriesRef.once('value').then(function(snapshot){
        categories = snapshot.val()
        return articlesRef.orderByChild('update_time').once('value')
    }).then(function(snapshot){
        const articles = []
        snapshot.forEach(function(snapshotChild){
            if( 'public' === snapshotChild.val().status){
                // console.log('child',snapshotChild.val())
                articles.push(snapshotChild.val())
            }
        })
        articles.reverse()
        const data = convertPagination(articles, currentPage)
        // console.log(data)

        // console.log(articles)
        // data transform array
        // articles = snapshot.val()
        // console.log(categories, articles)
        res.render('index', { 
            title: 'Express' ,
            articles: data.data,
            categories,
            stringtags,
            moment,
            page: data.page
        })
    })
})

//  set the router match the view folder
router.get('/post/:id', function(req, res, next) {
    const id = req.param('id')
    // console.log(id)
    let categories = {}
    // const categories = snapshot.val();
    categoriesRef.once('value').then(function(snapshot){
        categories = snapshot.val()
        return articlesRef.child(id).once('value')
    }).then(function(snapshot){
        const article = snapshot.val()
        // console.log(article)
        if(!article){
            return res.render('error',{
                title: '找不到該文章'
            })
        }
        res.render('post', { 
            title: 'post',
            categories,
            article,
            moment
        })
    })
})

router.get('/dashboard/signup', function(req, res, next) {
    res.render('dashboard/signup', { title: 'signup' })
})

module.exports = router;
