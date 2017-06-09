import 'dotenv/config';
import init from 'ale-persistence/init';
import hideStack from 'hide-stack-frames-from';
import knex from './config/knex';

hideStack('lodash', 'babel-register', 'bluebird');
init(knex);
