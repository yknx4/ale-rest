import { log } from 'logger';
import generateModel from './models';
import * as utils from './utils';
import * as graphql from './graphql';
import { libModels as models, libState as state } from './store';
import * as types from './types';

log(`AlePersistence ~`);

export { generateModel, utils, graphql, models, types, state };
