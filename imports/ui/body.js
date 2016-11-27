import { Template } from 'meteor/templating';
import { Connections } from '../api/connections.js';
import { Tags } from '../api/tags.js';
import { Amtquests } from '../api/amtquests.js';
import { Guardians } from '../api/guardians.js';

import './connection.js';
import './mapAndAmtQuests.js';
import './help.js';
import './guardians.js';
import './about.js';
import './body.html';
import './map.html';
import './notfound.html';

Template.body.onRendered(function bodyOnRendered() {
  var layout   = document.getElementById('layout'),
      menu     = document.getElementById('menu'),
      menuLink = document.getElementById('menuLink'),
      allMenus = document.getElementById('allMenus');

  menuLink.onclick = function (e) {
      toggleAll(e);
  };

  allMenus.onclick = function (e) {
      toggleAll(e);
  };

  hookContentMenuToggle();
});

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  connections() {
    console.log("Connection count helper " + Connections.find({}).count());
    return Connections.find({});
  },
  tags() {
    return Tags.find({});
  },
  amtquests() {
    return Amtquests.find({}, {sort: {date: 'dec'}});
  },
  guardians() {
    return Guardians.find({});
  },
  template_name: function(){
    var currentTemplate = Session.get("templateName");
    return currentTemplate;
  }
});

Template.body.events({
  "click .home": function(e) {
    if (Session.get("templateName") === "main") {
      return;
    }
    Session.set("templateName", "main");
    setTimeout(hookContentMenuToggle, 100);
  },
  "click .help": function(e) {
    if (Session.get("templateName") === "help") {
      return;
    }
    Session.set("templateName", "help");
    setTimeout(hookContentMenuToggle, 100);
  },
  "click .guardians": function() {
    if (Session.get("templateName") === "guardians") {
      return;
    }
    Session.set("templateName", "guardians");
    setTimeout(hookContentMenuToggle, 100);
  },
  "click .about": function() {
    if (Session.get("templateName") === "about") {
      return;
    }
    Session.set("templateName", "about");
    setTimeout(hookContentMenuToggle, 100);
  }
});
