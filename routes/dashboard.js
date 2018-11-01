var express = require('express');
var router = express.Router();
const stringtags = require('striptags')
const moment = require('moment')
var firebaseAdmin = require('../connections/firebase_admin')

// ref means reference
const categoriesRef = firebaseAdmin.ref('/categories/')
const articlesRef = firebaseAdmin.ref('/articles/')

// dashboard index route
router.get('/', (req, res) => {
    const messages = req.flash('error')
    res.render('dashboard/index', {
        title: 'Express',
        currentPath: '/',
        hasErrors: messages.length > 0
    })
})

// archives
router.get('/archives', function(req, res, next) {
    const status = req.query.status || 'public'
    let categories = {}
    categoriesRef.once('value').then(function(snapshot){
        categories = snapshot.val()
        return articlesRef.orderByChild('update_time').once('value')
    }).then(function(snapshot){
        const articles = []
        snapshot.forEach(function(snapshotChild){
            if( status === snapshotChild.val().status){
                // console.log('child',snapshotChild.val())
                articles.push(snapshotChild.val())
            }
        })
        articles.reverse()
        // console.log(articles)
        // data transform array
        // articles = snapshot.val()
        // console.log(categories, articles)
        res.render('dashboard/archives', { 
            title: 'archives' ,
            articles,
            categories,
            stringtags,
            moment,
            status
        })
    })
})

// about article
// create
router.get('/article/create', function(req, res, next) {
    categoriesRef.once('value').then(function(snapshot){
        const categories = snapshot.val()
        // console.log(categories)
        res.render('dashboard/article', {
            title: 'article' ,
            categories
        })
    })
})
router.post('/article/create', function(req, res, next) {
    // console.log(req.body)
    const data = req.body
    const articleRef = articlesRef.push()
    const key = articleRef.key
    const updateTime = Math.floor(Date.now() / 1000)
    data.id = key
    data.update_time = updateTime
    // console.log(data)
    articleRef.set(data).then(function(snapshot){
        console.log(snapshot)
        res.redirect(`/dashboard/article/${key}`)
    })
})

// article edit route
router.get('/article/:id', function(req, res, next) {
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
        res.render('dashboard/article', { 
            title: 'Express',
            categories,
            article
        })
    })
})

router.post('/article/update/:id', function(req, res, next) {
    const data = req.body
    const id = req.param('id')
    const updateTime = Math.floor(Date.now() / 1000)
    data.update_time = updateTime
    // console.log(data)
    articlesRef.child(id).update(data).then(function(snapshot){
        // console.log(snapshot)
        res.redirect(`/dashboard/article/${id}`)
    })
})

router.post('/article/delete/:id', function(req, res){
    const id = req.param('id')
    // console.log(id)
    articlesRef.child(id).remove()
    req.flash('info','文章已刪除')
    // we use the ajax
    res.send('文章已刪除')
    res.end()
    // res.redirect('/dashboard/categories')
})

// about categories
router.get('/categories', function(req, res, next) {
    const message = req.flash('info')
    categoriesRef.once('value').then(function(snapshot){
        const categories = snapshot.val();
        // console.log(categories)
        // res.render('dashboard/categories', { 
        //     title: 'Express' ,
        //     categories: categories
        // })
        res.render('dashboard/categories', { 
            title: 'Express' ,
            message,
            hasInfo: message.length > 0,
            categories
        })
    })
})
// create
router.post('/categories/create', function(req, res){
    const data = req.body
    // console.log(data)

    // only one category id == unique id
    // categories -> many defferent "category" in it
    const categoryRef = categoriesRef.push()
    const key = categoryRef.key
    data.id = key
    categoriesRef.orderByChild('path').equalTo(data.path).once('value')
        .then(function(snapshot){
            if(snapshot.val() !== null){
                req.flash('info','已有相同路徑')
                res.redirect('/dashboard/categories')
            }else{
                categoryRef.set(data).then(function(success){
                    res.redirect('/dashboard/categories')
                }).catch(function(error){
                    console.log(error)
                    res.redirect('/')
                })
            }
        })
})
// delete route
router.post('/categories/delete/:id', function(req, res){
    const id = req.param('id')
    // console.log(id)
    categoriesRef.child(id).remove()
    req.flash('info','欄位已刪除')
    res.redirect('/dashboard/categories')
})

module.exports = router;