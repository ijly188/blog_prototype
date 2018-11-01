var express = require('express');
var router = express.Router();
var firebaseClient = require('../connections/firebase_client')
let fireAuth = firebaseClient.auth()

router.get('/signup', (req, res) => {
    const messages = req.flash('error')
    res.render('dashboard/signup', {
        messages,
        hasErrors: messages.length > 0
    })
})

router.get('/signin', (req, res) => {
    const messages = req.flash('error')
    res.render('dashboard/signin',{
        messages,
        hasErrors: messages.length > 0
    })
})

router.get('/signout', (req, res) => {
    req.session.uid = ''
    res.redirect('/auth/signin')
})

router.post('/signup', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirm_password

    if (password !== confirmPassword) {
        req.flash('error', '密碼並不相符')
        res.redirect('/auth/signup')
    }

    fireAuth.createUserWithEmailAndPassword(email, password)
    .then( () => {
        console.log(req.session.uid)
        res.redirect('/auth/signin')
    })
    .catch( (error) => {
        console.log(error)
        req.flash('error', error.message)
        res.redirect('/auth/signup')
    })
})

router.post('/signin', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // console.log(firebaseClient.auth)

    fireAuth.signInWithEmailAndPassword(email, password)
    .then((user) => {
        // console.log(user.user.uid)
        req.session.uid = user.user.uid
        req.session.mail = req.body.email
        // console.log(res.session)
        res.redirect('/dashboard')
    })
    .catch((error) =>{
        console.log(error)
        req.flash('error', error.message)
        res.redirect('/auth/signin')
    })
})

module.exports = router;