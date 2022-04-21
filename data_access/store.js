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
  findCustomer(email){
    return pool.query('select * from imagequiz.customer where email = $1', [email])
    .then(x => {
      if (x.rows.length == 1){
        return {found: true, id: x.rows[0].id};
      }
      else{
        return {found: false};
      }
    })
  },


  findQuiz(quizName){
    return pool.query('select * from imagequiz.quiz where name = $1', [quizName])
    .then(x => {
      if (x.rows.length == 1){
        return {found: true, id: x.rows[0].id};
      }
      else{
        return {found: false};
      }
    })
  },


  addCustomer: (name, email, password) => {
    const hashpass = bcrypt.hashSync(password, 10);
    return pool.query('insert into imagequiz.customer (name, email, password) values ($1, $2, $3)', [name, email, hashpass])
    .then(x => {
      return {valid: true};
    })
    .catch(e => {
      return {valid: false};
    })
  },


  login: (email, password) => {
    return pool.query('select name, email, password from imagequiz.customer where email = $1', [email])
    .then(x => {
      if (x.rows.length == 1){
        let valid = bcrypt.compareSync(password, x.rows[0].password);
        if (valid){
          return {valid: true};
        }else{
          return {valid: false, message: 'Credentials are not valid.'}
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
    return pool.query('select * from imagequiz.flowers')
    .then(x => {
      if (x.rows.length > 0){
        let result = []
        for(let i in x.rows){
          result.push({"name": x.rows[i].name, "picture": x.rows[i].picture});
        }
        return {found: true, res: result, len: result.length}
      }
      else{
        return {found: false, res: []}
      }
    })
    .catch(e => {
      return {found: false}
    })
  },


  score: (quizTaker, quiz, score, date) => {
    return pool.query(`insert into imagequiz.score (customer_id, quiz_id, date, score) values ($1, $2, $3, $4)`, [quizTaker, quiz, date, score])
    .then(x => {
      return {valid: true};
    })
    .catch(e => {
      return {valid: false};
    })
  },


  getScores: (quizTaker,quizName) => {
    let sqlQuery = `select s.score from imagequiz.score s 
    join imagequiz.customer c on s.customer_id = c.id 
    where c.email = $1 and s.quiz_id = $2;`
    return pool.query(sqlQuery, [quizTaker.toLowerCase(), quizName.toLowerCase()])
    .then(x => {
      if (x.rows.length > 0){
        let result = []
        for(let i in x.rows){
          result.push(x.rows[i].score);
        }
        return {found: true, res: result, len: result.len}
      }
      else{
        return {found: false, res: []}
      }
    })
    .catch(e => {
      return {found: false, res: []}
    })   
  }
};

module.exports = { store };
