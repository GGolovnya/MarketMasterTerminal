const { access, refresh } = require('./jwtConfig');

module.exports = {
  access: {
    maxAge: access.expiresIn,
    httpOnly: true,
  },
  refresh: {
    maxAge: refresh.expiresIn,
    httpOnly: true,
  },
};
