import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

import '../imports/startup/iron-router.js';
import { recacheKingdomsAndParks } from './recacheKingdomsAndParks.js';

Meteor.startup(() => {
  // code to run on server at startup
  recacheKingdomsAndParks();
});
