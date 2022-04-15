const bcrypt = require("bcrypt");
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = 
  `postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

const connection = {
  connectionString : process.env.DATABASE_URL ? process.env.DATABASE_URL : connectionString,
  ssl: { rejectUnauthorized: false }
} 
const pool = new Pool(connection);


let store = {
  addCustomer: (name, email, password) => {
    const hashpass = bcrypt.hashSync(password, 10);
    return pool.query('insert into imagequiz.customer (name, email, password) values ($1, $2, $3)', [name, email, hashpass]);
  },

  login: (email, password) => {
    return pool.query('select name, email, password from imagequiz.customer where email = $1', [email])
    .then(x => {
      if (x.rows.length == 1){
        let valid = bcrypt.compareSync(password, x.rows[0].password);
        if (valid){
          return {valid: true};
        }else{
          return  {valid: false, message: 'Credentials are not valid.'}
        }
      }else{
        return {valid: false, message: 'Email not found.'}
      }
    })
  },

  getQuiz: (name) => {
    let sqlQuery = `select q.id as quiz_id, q2.* from imagequiz.quiz q join imagequiz.quiz_question qq on q.id = qq.quiz_id
    join imagequiz.question q2 on qq.question_id = q2.id
    where lower(q.name) = $1;`
    return pool.query(sqlQuery, [name.toLowerCase()])
    .then(x => {
      console.log(x);
      let quiz = {};
      if (x.rows.length > 0){
        quiz = {
          id: x.rows[0].quiz_id,
          questions: x.rows.map(y => { return {id: y.id, picture: y.picture, choices: y.choices, answer: y.answer} })
        }
      }
      return quiz;
    });    
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
