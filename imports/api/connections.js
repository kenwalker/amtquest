import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Connections = new Mongo.Collection('connections');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('connections', function connectionsPublication() {
    return Connections.find();
  });
}
 
Meteor.methods({
  'connections.insert'(content) {

    // check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
 	content.createdAt = new Date();
 	content.owner = this.userId;
 	content.username = Meteor.users.findOne(this.userId).profile.name;
 	Connections.insert( content );
  },
  'connections.remove'(connectionId) {
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    check(connectionId, String);

    if (Connections.findOne(connectionId).owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // This needs to update the record deleted state
    Connections.remove(connectionId);
  },
});