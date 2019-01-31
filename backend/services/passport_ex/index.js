
require('dotenv').config()

const passport = require('passport')
// const FacebookStrategy = require('passport-facebook')
// const TwitterStrategy = require('passport-twitter')
// const InstagramStrategy = require('passport-instagram')
// const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy
const axios = require('axios')
// const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github').Strategy

const express = require('express')
const app = express()

const CALLBACK_URL = '//127.0.0.1:3000'

// google, fb, tw, ig, li
const github = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL + "/auth/github/callback"
    // profileFields: ["id", "displayName", "photos"]
}  

/*
const li = {
    clientID: "",
    clientSecret: "",
    callbackURL: CALLBACK_URL + "/auth/linkedin/callback",
    //DOES NOT USE THIS! profileFields: ["id", "displayName", "photos"],
	scope: ['r_emailaddress', 'r_basicprofile'],
	state: true // AUTO State (requires session) required for linked-in to prevent CSRF
}
*/

function passport_strategy_set() {
    // SESSION START
    passport.serializeUser( (user,done) => {
		//console.log(user)
        //done(null, user.id) // user.id - from DB (id is pk)
        done(null, user)
    })
    passport.deserializeUser( (id,done) => {
        //findById(id)
        done(null, { id: 1 } )
    })
    // SESSION END
	
    let authProcessor = (accessToken, refreshToken, profile, done) => {
		//console.log(accessToken, refreshToken, profile)
		profile.accessToken = accessToken
		done(null, profile)
		// profile.id - returned from FB, check if in db
		// profile.displayName, profile.photos[0].value
		// if yes return user data, if not insert into db and return

		// asynchronous verification, for effect...
		//process.nextTick(function () {
			// To keep the example simple, the user's Instagram profile is returned to represent the logged-in user.  In a typical application, you would want
			// to associate the Instagram account with a user record in your database, and return that user instead.
			//return done(null, profile)
		//})

    }

    // passport.use( new FacebookStrategy(fb, authProcessor) )
    // passport.use( new TwitterStrategy(tw, authProcessor) )
    // passport.use( new InstagramStrategy(ig, authProcessor) )
    // passport.use( new LinkedinStrategy(li, authProcessor) )	
	// passport.use(new GoogleStrategy(google, authProcessor) )
    passport.use(new GitHubStrategy(github, authProcessor) )        
}

let isAuthenticted = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else res.redirect('/')
}

app.use(express.static('public'))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true })) // required for OAuth 1 (e.g. twitter), OAuth2 with state (e.g. linkedin)
app.use(passport.initialize())
app.use(passport.session()) // SESSION - call this AFTER calling express session

passport_strategy_set()

app.get('/', (req, res) => { res.send('Hello World! Or Semi Fail') })
app.get('/test', (req, res) => {
	res.send('TEST') 
})

app.use('/pass', isAuthenticted, (req, res, next) => { // the secure route
    res.redirect('/aa.html')
/*
    console.log('passed', (new Date()).toLocaleString(), req, req.session)
	// how to check if log in is instagram user?
	const token = req.session.passport.user.accessToken
	//console.log(req.session.passport)
	if (req.session.passport.user.provider == 'instagram') {
		const url = 'https://api.instagram.com/v1/users/self/media/recent'
		//const url = 'https://api.instagram.com/v1/users/leverandpunch/media/recent'
		axios.get(url+'/?access_token='+token).then(function (response) {
			// console.log(response.data)
			res.send(response.data)
            const images = response.data.data
            console.log(images)
			images.forEach( (e) => {
				console.log(e.id, e.caption.text, e.images.standard_resolution.url, e.user.username)
				
				const doc = {
					id: e.id,
					ts: e.created_time,
					caption: e.caption.text,
					url: e.images.standard_resolution.url,
					user: e.user.username,
					jobid: '',
					jobstatus: '',
					jobresult: ''
				}

				db.insert(doc, function (err, newDoc) {   // Callback is optional
					// newDoc is the newly inserted document, including its _id
					// newDoc has no key called notToBeSaved since its value was undefined
				})
			})			
			next()
		}).catch(function (error) {
			console.log(error)
			res.send('instagram authentication error!')
			next()
		})
	}
	else {
		res.send('Pass!')
		next()
    }
*/
})

app.use('/fail', (req, res, next) => {
    res.redirect('/bb.html')
	//console.log(req.session)
    // res.send('Fail! ' + (new Date()).toLocaleString())
	// next()
})

// app.get('/auth/facebook', passport.authenticate('facebook'))
// app.get('/auth/twitter', passport.authenticate('twitter'))
// app.get('/auth/instagram', passport.authenticate('instagram'))
// app.get('/auth/linkedin', passport.authenticate('linkedin'))
// app.get('/auth/google', passport.authenticate('google'))
app.get('/auth/github', passport.authenticate('github'))

// app.get('/auth/facebook/callback', passport.authenticate('facebook', { session:true, successRedirect: '/pass', failureRedirect: '/fail' }) )
// app.get('/auth/twitter/callback', passport.authenticate('twitter', { session:true, successRedirect: '/pass', failureRedirect: '/fail' }) )
// app.get('/auth/instagram/callback', passport.authenticate('instagram', { session:true, // if session false, isAuthenticated() = false
//     successRedirect: '/pass', failureRedirect: '/fail',
// }) )
// app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { session:true, successRedirect: '/pass', failureRedirect: '/fail' }) )
// app.get('/auth/google/callback', passport.authenticate('google', { session:true, successRedirect: '/pass', failureRedirect: '/fail' }) )
app.get('/auth/github/callback', passport.authenticate('github', { session:true, successRedirect: '/pass', failureRedirect: '/fail' }) )

app.get('/logout', (req, res, next) => {
	req.session.destroy(function (err) {
		console.log(err, 'bye')
		req.logOut()
		res.redirect('/') //Inside a callback… bulletproof!
	})
    // req.session.destroy()
    //req.logout()
    //res.redirect('/')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

/*
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '',
      xfbml      : true,
      version    : 'v2.9'
    })
    FB.AppEvents.logPageView()
  }

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0]
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
*/

