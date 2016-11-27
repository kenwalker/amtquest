import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Guardians = new Mongo.Collection('guardians');

Guardians.allow({
    insert: function (userId, doc) {
    	// if (userId === null) return false;
    	return true;
    }
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('guardians', function() {
    return Guardians.find();
  });
}
