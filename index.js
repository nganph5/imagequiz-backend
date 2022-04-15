const express = require("express");
const cors = require("cors");
const { store } = require("./data_access/store");

const application = express();
const port = process.env.PORT || 4002;

//middlewares
application.use(express.json());
application.use(cors());

//methods
application.get("/", (request, response) => {
  response
    .status(200)
    .json({ done: true, message: "Welcome to image quiz backend API!" });
});

application.post("/register", (request, response) => {
  let name = request.body.name;
  let email = request.body.email;
  let password = request.body.password;
  
  store.addCustomer(name, email, password)
  .then(x => response.status(200).json({done: true, message: 'The customer was added successfully'}))
  .catch(e => {
    console.log(e);
    response.status(500).json({done: false, message: 'The customer was not added due to an error.'})
  });
});

application.post("/login", (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  let result = store.login(email, password);
  if (result.valid) {
    response
      .status(200)
      .json({ done: true, message: "The customer " + email + " logged in successfully!" });
  } else {
    response.status(401).json({ done: false, message: result.message });
  }
});

application.get("/quiz/:name", (request, response) => {
  let name = request.params.name;
  store.getQuiz(name)
  .then(x => {
    if (x.id){
      response.status(200).json({ done: true, result: x });
    }else{
      response.status(404).json({ done: false, message: result.message });
    }
  })
  .catch(e => {
    console.log(e);
    response.status(500).json({ done: false, message: 'Something went wrong.' });
  });
});

application.get("/flowers", (request, response) => {
  let result = store.getFlower();
  if (result.done) {
    response.status(200).json({ done: true, result: result.flowerlist });
  } else {
    response.status(404).json({ done: false, message: result.message });
  }
});

application.post("/score", (request, response) => {
  let quizTaker = request.body.quizTaker;
  let quizName = request.body.quizName;
  let score = request.body.score;
  let date = new Date().toISOString().slice(0, 10);
  let stored = store.score(quizTaker, quizName, score, date);
  console.log(stored);
  if (stored.done) {
    response.status(200).json({ done: true, message: store.message });
  }
});
application.get("/scores/:quiztaker/:quizname", (request, response) => {
  let quizTaker = request.params.quiztaker;
  let quizName = request.params.quizname;
  let score = store.getScores(quizTaker, quizName);
  console.log(score);
  if (score.done) {
    response.status(200).json({ done: true, result: score.result });
  } else {
    response.status(404).json({ done: false, message: score.message });
  }
});

application.listen(port, () => {
  console.log(`Listening to the port ${port} `);
});
