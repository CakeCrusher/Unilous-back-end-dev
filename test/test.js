var assert = require('assert');
var db = require("./test_db");
var fs = require('fs');

var sql = fs.readFileSync('init_database.sql').toString();

describe('mutations', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('queries', function () {
    // runs before all tests in this file regardless where this line is defined.
    before(function() {
        
    });

    // runs before each test in this block
    beforeEach(function() {
        db.query("BEGIN");
    });

    // runs after each test in this block
    afterEach(function() {
        db.query("ROLLBACK");
    });

    describe('searchAwaitingNotifs', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('me', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('searchAnsweredQToPost', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('searchPosts', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('getListOfPosts', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('findPost', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('findUser', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('allUsers', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('allPosts', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('allSkills', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('skillSearch', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('allNotifications', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });

    describe('listOfNotifications', function () {
        describe('valid', function(){
        });
        describe('invalid', function(){
        });
    });
  });