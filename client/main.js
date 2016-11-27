import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/startup/accounts-config.js';
import '../imports/startup/iron-router.js';
import '../imports/ui/body.js';
import '../imports/ui/map.js';
import '../imports/ui/park.js';
import '../imports/ui/amtquest.js';
import '../imports/ui/amtquestlist.js';
import '../imports/ui/guardians.js';
// import './css/modal.css';

 if(Meteor.isClient) {
    Meteor.startup(function() {
    	Session.setDefault("templateName", "main");
    	Meteor.subscribe('connections');
    	Meteor.subscribe('tags');
    	Meteor.subscribe('kingdoms');
    	Meteor.subscribe('parks');
    	Meteor.subscribe('amtquests');
    	Meteor.subscribe('guardians');
    });
 }

