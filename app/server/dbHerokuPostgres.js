var path = require('path');
var pg = require('pg');
var localPWD;

try {
  localPWD = require('../../localPWD.js'); //download this and save it in the root of /fetch
} catch (ex) {
  console.log(ex, "...but it's cool, we're using process variables");
  // Capture process.env variables during node's start up
  localPWD = {
    user: process.env.DATABASE_URL.split(':')[1].slice(2),
    password: process.env.DATABASE_URL.split(':')[2].split('@')[0],
    database: process.env.DATABASE_URL.split(':')[3].split('/')[1]
  };
}

// Use a connection object; do NOT try using a connection url. Known issue.
// https://github.com/tgriesser/knex/issues/852

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: "ec2-107-21-219-142.compute-1.amazonaws.com",
    port: "5432",
    user: localPWD.user,
    password: localPWD.password,
    database: localPWD.database,
    ssl: true
  }
});



knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('email');
      user.string('password');
      user.integer('zip');
      user.binary('hasDog');
      user.string('firstName');
      user.string('lastName');
    }).then(function(table) {
      console.log('made the user table', table);
    })
  }
});

knex.schema.hasTable('dogs').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('dogs', function(dog) {
      dog.increments('id').primary();
      dog.integer('userId')
        .unsigned()
        .references('id')
        .inTable('users');
      dog.integer('shelterId')
        .unsigned()
        .references('id')
        .inTable('shelters');
      dog.string('name');
      dog.binary('isMale');
      dog.string('blurb');
      dog.string('activity');
      dog.string('photoUrl');
      dog.string('breed');
      dog.binary('isAvail');
      dog.integer('outings').defaultTo(0); // added this field to track number of times out of kennel
    }).then(function(table) {
      console.log('dog table has been made');
    })
  }
});

knex.schema.hasTable('shelters').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('shelters', function(shelter) {
      shelter.increments('id').primary();
      shelter.integer('zip');
      shelter.string('email');
      shelter.string('displayName');
      shelter.string('password');
    }).then(function(table) {
      console.log('shelter table has been made');
    })
  }
});




//BOOKSHELF MODEL COLLECTION ABSTRACTIONS BELOW:

var bookshelf = require('bookshelf')(knex)

var User = bookshelf.Model.extend({
  tableName: 'users',
  dog: function() {
    return this.hasOne(Dog);
  }
});

var Dog = bookshelf.Model.extend({
  tableName: 'dogs',
  shelter: function() {
    return this.belongsTo(Shelter);
  },
  user: function() {
    return this.belongsTo(User);
  }
});

var Shelter = bookshelf.Model.extend({
  tableName: 'shelters',
  dog: function() {
    return this.hasMany(Dog);
  }
});

// var Dogs = bookshelf.Collection.extend({
//   model: Dog
// })




module.exports.User = User;
module.exports.Dog = Dog;
module.exports.Shelter = Shelter;
