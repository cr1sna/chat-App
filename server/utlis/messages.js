// const generateMessage = text => {
//   text;
//   dateCreated: new Date().getTime();
// };
const generateMessage = text => {
  return { text, dateCreated: new Date().getTime() };
};

const generatelocationMessaage = text => {
  return { text, dateCreated: new Date().getTime() };
};

// console.log(generateMessage("Welcome"));

module.exports = { generateMessage, generatelocationMessaage };
