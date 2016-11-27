import { Template } from 'meteor/templating';
import { Amtquests } from '../api/amtquests.js';
import { Parks } from '../api/parks.js';
import './amtquest.html';

Template.amtquest.helpers({
	zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	},
	parkID() {
		if (this.park_id) {
			var park = Parks.findOne({_id: this.park_id});
			if (park) return park.ParkId;
		}
		returh -1;
	},
	amtquests(search) {
    	return Amtquests.find({search});
  	},
  	parks(search) {
  		return Parks.find({search});
  	},
  	knownLocation() {
  		return this.name !== 'No match, please help';
  	},
  	tagDate() {
  		return this.date.toDateString();
  	},
  	userLoggedIn() {
  		return Meteor.userId() != null;
  	}
});

Template.amtquest.events({
	'click': function(){
		var eventName = prompt("Event name or Park where this AmtQuest happened");
		if (eventName === null || eventName === "") return;
		if (eventName.length > 50) {
			alert("Event name can be up to 50 characters");
			return;
		}
		var park = Parks.findOne({ "Name": { 
			"$regex": "^" + eventName + "\\b", "$options": "i"
		}});
		if (park) {
			Amtquests.update(this._id, {
		      $set: { name: eventName, park_id: park._id, edit_user_id: Meteor.userId() }
	    	});
		} else {
			Amtquests.update(this._id, {
	      		$set: { name: eventName, edit_user_id: Meteor.userId() }
	    	});
		}
	}	
})
