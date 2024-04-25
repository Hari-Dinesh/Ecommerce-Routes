
import JWT from "jsonwebtoken";
import createError from 'http-errors';

const jwtHelper = {
  signAccessToken: (data) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "yours hero",
        data:data
      };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "10d",
        issuer: 'tericsoft',
        
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const token = req.headers['authorization']
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
      req.payload = payload
      next()
    })
  },

  signRefreshToken: (Phone) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "yours hero",
      };
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: 'tericsoft',
        audience: Phone,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(createError.Unauthorized());
          }
          const Phone = payload.aud;
          resolve(Phone);
        }
      );
    });
  }
};

export {jwtHelper};
