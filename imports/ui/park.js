import { Template } from 'meteor/templating';
import { Amtquests } from '../api/amtquests.js';
import './park.html';

Template.park.helpers({
	zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	},
	fancyName() {
		if (this.Title) {
			return this.Title + " of " + this.Name;
		}
		return this.Name;
	},
	hasUrl() {
		if (this.Url) {
			return this.Url.length > 0;
		}
		return false;
	},
	formattedUrl() {
		var lowerUrl = this.Url.toLowerCase();
		if (lowerUrl.indexOf("http") == -1) {
			return "http://" + lowerUrl;
		}
		return lowerUrl;
	},
	amtquestConfirmed() {
		return Amtquests.findOne({deleted: false, park_id: this._id}) != null;
	}
});