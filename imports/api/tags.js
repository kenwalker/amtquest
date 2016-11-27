import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tags = new Mongo.Collection('tags');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tags', function tagsPublication() {
    return Tags.find({deleted: {$ne:true}});
  });
}
