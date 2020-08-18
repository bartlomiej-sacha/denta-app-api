"use strict";

var mongose = require('mongoose');

var Schema = mongose.Schema;

var bcrypt = require('bcrypt');

var saltRounds = 10;
var UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false
  },
  role: {
    type: String,
    trim: true,
    "default": 'ADMIN'
  }
}, {
  versionKey: false
}); // type - typ
// trim - pomija białe znaki
// required - wymagany
// select - pomiń przy zwracaniu obiektu
// default - domyślna wartość
// ustawiłem ponieważ planowo rozwojowo chce dodać role dla użytkowników
//Bcrypt to funkcja skrótu kryptograficznego, która powstała w oparciu o szyfr blokowy Blowfish. Została stworzona głównie w celu hasowania haseł statycznych, a nie jak inne znane funkcje do hashowania dowolnych danych binarnych. Dzięki zastosowaniu soli jest odporna na ataki typu ‚rainbow table’. Pozwala sterować jego złożonością obliczeniową poprzez zmianę ilości rund w procesie hasowania (tzw. work factor). Daje nam to dużą elastyczność przeciwko atakom w przyszłości.

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongose.model('users', UserSchema);