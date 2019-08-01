import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Kingdoms } from '../imports/api/kingdoms.js';
import { Parks } from '../imports/api/parks.js';

export function recacheKingdomsAndParks() {
  // TODO: need a way to determine when to update the cache
  if (false) return;

  var result = HTTP.get("https://ork.amtgard.com/orkservice/Json/index.php?request=&call=Kingdom%2FGetKingdoms");
  var kingdoms = result.data["Kingdoms"];

  console.log(Object.keys(kingdoms).length + " Kingdoms");
  Object.values(kingdoms).forEach(function(kingdom) {
  	kingdom.Active = kingdom.Active == "Active"; 

  	// Add or update the kingdom db record
  	Kingdoms.upsert( { KingdomId: kingdom.KingdomId }, kingdom);

	var resultParks = HTTP.get("https://ork.amtgard.com/orkservice/Json/index.php?call=Kingdom%2FGetParks&request%5BKingdomId%5D=" +  kingdom.KingdomId);
	var parks = resultParks.data["Parks"];

	if (parks) { 
	  console.log(Object.keys(parks).length + " parks for " + kingdom.KingdomName);
	  Object.values(parks).forEach(function(park) {
  	  	park.Active = park.Active == "Active"; 

  	  	// Set the KingdomId, sometimes it is incorrect or null
  	  	park.KingdomId = kingdom.KingdomId;
  	  	park.KingdomName = kingdom.KingdomName;

  	  	// Change the location to be an object vs a string
  	  	if (park.Location) {
	  	  	park.Location = JSON.parse(park.Location.replace(/\\/g,''));
			}
			var aPark = Parks.findOne({ ParkId: park.ParkId});
			if (aPark) {
				if (aPark.Location || park.Location) {
					if (aPark.Location && !park.Location) {
						console.log(aPark.Name + " now non null");
					} else if (!aPark.Location && park.Location) {
						console.log(aPark.Name + " now null");
					} else {
						if (!_.isEqual(aPark.Location.location, park.Location.location)) {
							console.log(park.Name + " changing location");
						}
					}
				}
			} else {
				console.log("Adding " + park.Name);
			}
	  	// Add or update the park db record
	  	Parks.upsert( { ParkId: park.ParkId }, park);
	  });
	}
  });
}

