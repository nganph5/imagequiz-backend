const bcrypt = require("bcrypt");
let { customers } = require("./customers");
let { quizzes } = require("./data");
let { flowers } = require("./flowers");
let { scores } = require("./scores");

let store = {
  addCustomer: (name, email, password) => {
    const hashpass = bcrypt.hashSync(password, 10);
    let id = customers.length;
    if (customers.includes(email)) {
      return { done: false, message: "Customer exists" };
    } else {
      customers.push({ id: id, name: name, email: email, password: hashpass });
      return { done: true, message: "add succesfully" };
    }
  },

  login: (email, password) => {
    let customer = customers.find(
      (x) => x.email.toLowerCase() === email.toLowerCase()
    );
    if (customer) {
      let valid = bcrypt.compareSync(password, customer.password);
      if (valid) {
        return { valid: true };
      } else {
        return { valid: false, message: "Credentials are not valid." };
      }
    } else {
      return { valid: false, message: "Email not found." };
    }
  },

  getQuiz: (id) => {
    let quiz = quizzes.find((x) => x.name.toLowerCase() === id.toLowerCase());
    if (quiz) {
      return { done: true, quiz };
    } else {
      return { done: false, message: "No quiz with this game was found." };
    }
  },

  getFlower: () => {
    let flowerlist = flowers;
    return { done: true, flowerlist };
  },

  score: (quizTaker, quizName, score, date) => {
    scores.push({
      quizTaker: quizTaker,
      quizId: quizName,
      score: score,
      date: date
    });
    return { done: true, message: "Score is saved" };
  },

  getScores: (quizTaker,quizName) => {
    res = [];
    for(let i = 0; i < scores.length; i++){
      let s = scores[i];
      if (s.quizTaker === quizTaker && s.quizId === quizName){
        res.push(s.score);
      }
    }
    if (res.length > 0) {
      return { done: true, result: res, message: "here is the score" };
    } else {
      return { done: false, message: "Undefined" };
    }
  },
};

module.exports = { store };
