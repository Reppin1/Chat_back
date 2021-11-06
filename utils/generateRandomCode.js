const MAX = 9999
const MIN = 1000
const generateRandomCode = () => {
  return  Math.floor(Math.random() * (MAX - MIN + 1)) + MIN
};

module.exports = generateRandomCode