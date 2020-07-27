const supertest = require('supertest');
const chai = require('chai');
const server = require('../server');

global.request = supertest(server);
global.expect = chai.expect;
