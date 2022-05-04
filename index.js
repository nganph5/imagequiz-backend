const express = require('express');
var cors = require('cors');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
const { store } = require('./data_access/store');
//let backendURL = "http://localhost:4002";
//let frontEndUrl = "http://localhost:3000";
let backendURL = "https://nganph5-imagequiz-api.herokuapp.com";
let frontEndUrl = "https://nganph5.github.io";


const application = express();
const port = process.env.PORT || 4002;
application.set("port", port);


//middlewares
application.use(express.json());
application.use(cors(
  {
  origin: frontEndUrl,
  credentials: true}
));


application.use((request, response, next) => {
  next();
})


passport.use(new LocalStrategy(
  { usernameField: 'email'}, 
  function verify(username, password, cb) {
  store.login(username, password)
  .then(x => {
    if (x.valid){
      return cb(null, x.user)
    }else{
      return cb(null, false, {message: 'Incorrect username or password.'})
    }
  })
  .catch(e => {
    cb('Something went wrong!');
  })
}));


passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${backendURL}/auth/google/callback`,
    passReqToCallback: true
  },
function (request, accessToken, refreshToken, profile, done) {
  store.findOrCreateNonLocalCustomer(profile.displayName, profile.email, profile.id, profile.provider)
    .then(x => done(null, x))
    .catch(e => {
      console.log(e);
      return done('Something went wrong.');
  });
}));


application.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './sessions' })
}));
application.use(passport.authenticate('session'));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});


//methods
application.get('/', (request, response) => {
  response.status(200).json({ done: true, message: 'Welcome to hello world backend API!' });
});


application.post('/register', (request, response) => {
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.password;

  store.addCustomer(name, email, password)
    .then(x => response.status(200).json({ done: true, message: 'The customer was added successfully!' }))
    .catch(e => {
      console.log(e);
      response.status(500).json({ done: false, message: 'The customer was not added due to an error.' });
    });
});

application.post('/login', passport.authenticate('local',{
  successRedirect: '/login/succeeded',
  failureRedirect: '/login/failed'
}));


application.get("/login/succeeded", (request, response) => {
  response.status(200).json({ done: true, message: "The customer logged in successfully!" });
});


application.get("/login/failed", (request, response) => {
  response.status(401).json({ done: false, message: "Invalid credentials!" });
});


application.get('/auth/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
  ));

application.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  }));

  application.get('/auth/google/success', (request, response) => {
    console.log(request)
    response.redirect(`${frontEndUrl}/imagequiz/#/google/${request.user.username}/${request.user.name}`);
  
  });
  application.get('/auth/google/failure', (request, response) => {
    response.redirect(`${frontEndUrl}/imagequiz/#`);
  });


application.post('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
});


application.get('/isloggedin', (request, response) => {
  console.log(request)
  if(request.isAuthenticated()) {
    response.status(200).json({ done: true, result: true });
  } else {
    response.status(410).json({ done: false, result: false });
  }  
});


application.get("/quiz/:name", (request, response) => {
  if (!request.sessionID){
    response.status(401).json({done: false, message: 'Please sign in first.'});
  }
  let name = request.params.name;
  store.getQuiz(name)
  .then(x => {
    if (x.id){
      response.status(200).json({ done: true, result: x });
    }else{
      response.status(404).json({ done: false, message: "Cannot find quiz " + name });
    }
  })
  .catch(e => {
    response.status(500).json({ done: false, message: 'Something went wrong.' });
  });
});


application.get("/flowers", (request, response) => {
  store.getFlowers()
  .then(x => {
    if (x.found){
      response.status(200).json({done: true, result: x.res});
    }else{
      response.status(404).json({done: false, result: x.res});
    }
  })
  .catch(e => {
    response.status(404).json([]);
  })
});


application.get("/quizzes", (request, response) => {
  store.getQuizzes()
  .then(x => {
    if (x.found){
      response.status(200).json({done: true, result: x.res});
    }else{
      response.status(404).json({done: true, result: x.res});
    }
  })
  .catch(e => {
    response.status(404).json([]);
  })
});


application.get("/scores/:quiztaker/:quizname", (request, response) => {
  let quizTaker = request.params.quiztaker;
  let quizName = request.params.quizname;

  store.getScores(quizTaker, quizName)
  .then(x => {
    if (x.found){
      response.setHeader();
      response.status(200).json({done: true, result: x.res, message: x.len + " scores found."});
    }else{
      response.status(404).json({done: false, result: x.res, message: "0 score found."});
    }
  })
  .catch(e => {
    response.status(404).json({done: false, result: [], message: "Cannot retrieve " + quizTaker + " result in quiz " + quizName + " due to an error."});
  })
});


application.post("/score", (request, response) => {
  let quizTaker = request.body.quizTaker;
  let quizName = request.body.quizName;
  let score = request.body.score;
  let date = new Date().toISOString().slice(0, 10);

  store.findCustomer(quizTaker)
  .then((resp) => {
    if (resp.found == false){
      response
      .status(400)
      .json({ done: false, message: "The quizTaker " + quizTaker + " is not found.", result: []});
    }else{
      const taker_id = resp.id;
      store.findQuiz(quizName)
      .then((resp) => {
        if (resp.found){
          const quiz_id = resp.id;
          store.score(taker_id, quiz_id, score, date)
          .then((resp) => {
            if (resp.valid){
              response
              .status(200)
              .json({ done: true, message: "The score " + score + " of user " + quizTaker + " for quiz " + quizName + " on " + date + " was added successfully!"
             , result: resp.res});
            }else{
              response
              .status(500)
              response.status(500).json({ done: false, message: "Could not add the requested score.", result: []});
            }
          })
          .catch(e => {
            response.status(500).json({ done: false, message: "Could not add the requested score.", result: []});
          });

        }else{
          response
          .status(400)
          .json({ done: false, message:"The quiz " + quizName + " is not found.", result: []});
        }
      })
    }
  })
  .catch(e => {
    response.status(500).json({ done: false, message: "Could not add the requested score." , result: []});
  });
});

application.listen(port, () => {
  console.log(`Listening to the port ${port} `);
});
