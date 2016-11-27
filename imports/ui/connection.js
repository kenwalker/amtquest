import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import './connection.html';
 
Template.connection.events({
  'click .delete'() {
    Meteor.call('connections.remove', this._id);
  },
});


Template.connection.helpers({
    isOwner:function(){
    	var result = this.owner && this.owner == Meteor.userId();
    	console.log(result); 
    	return result;
    }
})