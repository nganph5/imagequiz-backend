const express = require("express");
const cors = require("cors");
const { store } = require("./temporarily-store/store");

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
  let register = store.addCustomer(name, email, password);
  if (register.done == false) {
    response
      .status(403)
      .json({ done: true, message: "The customer was not added!" });
  } else {
    response
      .status(200)
      .json({ done: true, message: "The customer was added successfully!" });
  }
});

application.post("/login", (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  let result = store.login(email, password);
  if (result.valid) {
    response
      .status(200)
      .json({ done: true, message: "The customer was added successfully!" });
  } else {
    response.status(401).json({ done: false, message: result.message });
  }
});

application.get("/quiz/:id", (request, response) => {
  let id = request.params.id;
  let result = store.getQuiz(id);
  if (result.done) {
    response.status(200).json({ done: true, result: result.quiz });
  } else {
    response.status(404).json({ done: false, message: result.message });
  }
});

application.get("/flowers", (request, response) => {
  //let flowers = request.params.flowers;
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
  let store = store.score(quizTaker, quizName, score, date);
  if (store.done) {
    response.status(200).json({ done: true, message: store.message });
  }
});
application.get("/scores/:quiztaker/:quizname", (request, response) => {
  let quizTaker = request.params.quiztaker;
  let quizName = request.params.quizname;
  let score = store.getScores(quizTaker, quizName);
  //let result = store.getQuiz(id);
  if (score.done) {
    response.status(200).json({ done: true, result: score.result });
  } else {
    response.status(404).json({ done: false, message: result.message });
  }
});

application.listen(port, () => {
  console.log(`Listening to the port ${port} `);
});
