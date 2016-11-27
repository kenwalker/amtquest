import { Template } from 'meteor/templating';
import { Guardians } from '../api/guardians.js';

import './guardians.html';

Template.guardians.helpers({
	userLoggedIn() {
		return Meteor.userId() != null;
	},
	guardians() {
		return Guardians.find({}, {sort: {createdAt: 'dec'}});
	},
	guardianName() {
		var currentGuardian = Guardians.findOne({}, {sort: {createdAt: 'dec'}});
		if (currentGuardian) {
			return currentGuardian.name;
		}
		return "No Current Guardian";
	},
	guardianDate() {
		var currentGuardian = Guardians.findOne({}, {sort: {createdAt: 'dec'}});
		if (currentGuardian) {
			var date = currentGuardian.createdAt;
			return moment(date).format("MMM Do, YYYY");
		}
		return "No current Guardian";
	},
	formatedDate(date) {
		return moment(date).format("MMM Do, YYYY");
	},
	buttonStateForUser() {
		var profileName = Meteor.user().profile.name;
		var guardianName = Guardians.findOne({}, {sort: {createdAt: 'dec'}}).name;
		return profileName === guardianName ? "pure-button-disabled" : "";
	}
});

Template.guardians.events({
	'click .claimguardianship': function(){
		var currentGuardian = Guardians.findOne({}, {sort: {createdAt: 'dec'}});
		if (currentGuardian) {
			if (Meteor.user().profile.name === currentGuardian.name) {
				return;
			}
		}
		var newGuardian = {
			name: Meteor.user().profile.name,
			userID: Meteor.userId(),
			createdAt: new Date(),
			deleted: false
		};
		Guardians.insert(newGuardian);
	}
});