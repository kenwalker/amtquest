import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Amtquests = new Mongo.Collection('amtquests');

Amtquests.allow({
    update: function (userId, doc, fieldNames, modifier) {
    	if (userId === null) return false;
    	if (_.without(fieldNames, 'name', 'park_id', 'edit_user_id').length > 0) {
    		return false;
    	}
    	return true;
    }
})

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('amtquests', function amtquestsPublication() {
    return Amtquests.find({deleted: {$ne:true}});
  });
}
