import { Template } from 'meteor/templating';
import { Amtquests } from '../api/amtquests.js';
import { Parks } from '../api/parks.js';
import './amtquestlist.html';

Template.amtquestlist.helpers({
	zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	},
	isEvent() {
		return !this.park_id;
	},
	parkID() {
		if (this.park_id) {
			var park = Parks.findOne({_id: this.park_id});
			if (park) return park.ParkId;
		}
		returh -1;
	},
	amtquests(search) {
    	return Amtquests.find({search}).sort();
  	},
  	parks(search) {
  		return Parks.find({search});
  	},
  	knownLocation() {
  		var mapTemplate = Template.instance("map");
  		return this.name !== 'No match, please help';
  	},
  	tagDate() {
  		return moment(this.date).format("dd, MMM Do, YYYY");
  	}
});

Template.amtquestlist.events({
	'click li': function(){
		mapGlobal.panTo(new L.LatLng(this.lat, this.lon));
		if (history.pushState) {
			var stateObject = { dummy: true };
		    var url = window.location.protocol
		        + "//"
		        + window.location.host
		        + window.location.pathname
		        + '?amtquest='
		        + this._id;
	    	history.pushState(stateObject, jQuery(document).find('title').text(), url);
	    }
	}	
})
