const jwt = require('jsonwebtoken')

const createJwtToken = (user) => {
  const token = jwt.sign(
    {
      user,
    },
    process.env.JWT_SECRET_KEY || '',
    {
      expiresIn: process.env.JWT_MAX_AGE,
      algorithm: 'HS256',
    },
  );
  return token;
};

module.exports = createJwtToken