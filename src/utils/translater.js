const translatte = require("translatte");
const { LANGUAGES } = require("./languages.js");

const Translate = async (question, answer) => {
  const translated_questions = {};
  const translated_answers = {};

  let questionPromises = [], answerPromises = [];

  if (question) {
    questionPromises = LANGUAGES.map((val) => {
      return new Promise((resolve, reject) => {
        translatte(question, { to: val })
          .then((res) => {
            translated_questions[val] = res.text;
            resolve("resolved");
          })
          .catch((err) => {
            console.warn(`Error while translating question to ${val} : ${err}`);
            resolve("resolved");
          });
      });
    });
  }

  if (answer) {
    answerPromises = LANGUAGES.map((val) => {
      return new Promise((resolve, reject) => {
        translatte(answer, { to: val })
          .then((res) => {
            translated_answers[val] = res.text;
            resolve("resolved");
          })
          .catch((err) => {
            console.warn(`Error while translating answer to ${val} : ${err}`);
            resolve("resolved");
          });
      });
    });
  }

  const Promises = [...answerPromises, ...questionPromises];

  await Promise.all(Promises).catch((err) => {
    console.warn("Something unexpected occured:", err);
  });

  let res = {};

  res["translated_answers"] = answer ? translated_answers : null;
  res["translated_questions"] = question ? translated_questions : null;

  return res;
};

module.exports = { Translate };
