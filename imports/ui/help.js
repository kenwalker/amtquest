import { Template } from 'meteor/templating';

import './help.html';

Template.help.events({
	'click #guardians': function(e){
		$(".guardians").click();
		toggleAll(e);
	},
	'click #home': function(e){
		$(".home").click();
		toggleAll(e);
	},
	'click #about': function(e){
		$(".about").click();
		toggleAll(e);
	}
})