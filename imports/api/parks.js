import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { geolib } from 'meteor/outatime:geolib';

export const Parks = new Mongo.Collection('parks');

// What's a reasonable distance for a tag to be considered within range of a Park?
const TAG_WITHIN_DISTANCE = 2000;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('parks', function parksPublication() {
    return Parks.find({Active: true});
  });
}

/*
 * Determine if a park is in range of a specfic lat ang lon
 *
 * @param latlon { lat: float, lon: float}
 * @returns {Object} the park or null if no match
 */

export function parkInRangeOfTag(latlon) {
	var tagLocation = {
		latitude: latlon.lat,
		longitude: latlon.lon
	};
	var parksToCheck = Parks.find({$and : [ {"Location":{$ne:null}}, {"Location":{$ne:""}}]}).fetch();
	var result = parksToCheck.find(function (park) {
		// console.log(park.Name);
		var parkLocation = {
			latitude: park.Location.location.lat,
			longitude: park.Location.location.lng
		};
		var distance = geolib.getDistance( tagLocation, parkLocation);
		// return distance <= TAG_WITHIN_DISTANCE;
		if (distance < TAG_WITHIN_DISTANCE) {
			console.log("Found match " + park.Name);
			return true;
		}
		return false;
	});
	return result;
}
