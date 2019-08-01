import { Template } from 'meteor/templating';
import { geolib } from 'meteor/outatime:geolib';
import { Amtquests } from '../api/amtquests.js';

import './mapAndAmtQuests.html';


Template.main.helpers({
  amtquests() {
    return Amtquests.find({}, {sort: {date: 'dec'}});
  },
  distance() {
    var now = Date.now();
    var a = Amtquests.find({ deleted: false });
    var a = a.fetch();
    var total = 0;
    console.log("there are " + a.length);
    a.forEach(function(item) { item.loc = { latitude: item.lat, longitude: item.lon } });
    console.log("there are still " + a.length);
    console.log(a);
    for (i=1; i<a.length;i++) {
      km = Math.round((geolib.getDistance(a[i-1].loc, a[i].loc) / 1000));
      total = total + km;
      console.log(a[i-1].name  + " to " + a[i].name + " " + km + " Km")
    };
    console.log("time is " + (Date.now() - now));
    return total.toLocaleString();
  }
});