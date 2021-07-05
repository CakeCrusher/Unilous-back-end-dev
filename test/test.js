var assert = require('assert');
//var db = require("./test_db");
//var fs = require('fs');

//var sql = fs.readFileSync('init_database.sql').toString();

import { withApollo } from "next-apollo"
// import ApolloClient, { HttpLink, InMemoryCache } from "apollo-boost"

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
// https://unilous-graphql-backend.herokuapp.com/graphql
// testDB

const httpLink = createHttpLink({
  uri: 'https://unilous-back-end-nextjs.herokuapp.com/graphql',
})

const authLink = setContext((_, { headers }) => {
  let token = null
  if(typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }
  return {
      headers: {
          ...headers,
          authorization: token ? `Unilous*2000 ${token}` : null,
      }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

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
        //db.query("BEGIN");
    });

    // runs after each test in this block
    afterEach(function() {
        //db.query("ROLLBACK");
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