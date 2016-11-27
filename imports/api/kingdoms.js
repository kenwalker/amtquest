import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Kingdoms = new Mongo.Collection('kingdoms');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('kingdoms', function kingdomsPublication() {
    return Kingdoms.find();
  });
}
