const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const restricted = require("../auth/restricted-middleware.js");

const server = express();

// const sessionConfig = {
//     name: "monster",
//     secret: "keep it secret, keep it safe!",
//     cookie: {
//       maxAge: 1000 * 60 * 60,
//       secure: false, // true in production to send only over https
//       httpOnly: true, // true means no access from JS
//     },
//     resave: false,
//     saveUninitialized: true, // GDPR laws require to check with client
//   };

server.use(helmet());
server.use(express.json());
server.use(cors());
//server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/users", restricted, checkRole("user"), usersRouter);

module.exports = server;

function checkRole(role) {
  return (req, res, next) => {
    if (
      req.decodedToken &&
      req.decodedToken.role &&
      req.decodedToken.role.toLowerCase() === role
    ) {
      next();
    } else {
      res.status(403).json({ you: "Shall not pass!" });
    }
  };
}
