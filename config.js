"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  "mongodb+srv://rzavala1989:illmatic774@do-betr-business.1nfsu.mongodb.net/do-betr-business" ||
  "mongodb://localhost/do-betr-business";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/do-betr-business-test";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
exports.CLIENT_ORIGIN =
  "https://desolate-taiga-15973.herokuapp.com" || "http://localhost:3000";
