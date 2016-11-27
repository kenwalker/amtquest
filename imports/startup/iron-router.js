import { Connections } from '../api/connections.js';
import { Tags } from '../api/tags.js';
import { Amtquests } from '../api/amtquests.js';
import { Guardians } from '../api/guardians.js';
import { parkInRangeOfTag, Parks } from '../api/parks.js';

Router.configure({
    notFoundTemplate: "notfound"
});

Router.route('/webhooks/particle', { where: 'server' })
  .post(function () {
  	var result = false;
  	var res = this.response;
  	var body = this.request.body;
  	var event = body.event;
  	var api_key = body.api_key;

  	if (api_key == "testing123") {

	  	if (event == "CONN") {
		  	console.log("Receiving CONN data");
		  	var data = JSON.parse(body.data);
		  	var newData = {
		  		battery: data.s,
		  		charging: (data.c == 1),
		  		powered: (data.p == 1),
		  		createdAt: new Date(),
		  		coreid: body.coreid
		  	}
			console.log(newData);
		 	Connections.insert( newData );
		 	result = true;
	  	}

	  	if (event == "TAG") {
		  	console.log("Receiving TAG data");
		  	var data = JSON.parse(body.data);
		  	data.createdAt = new Date();
		  	data.coreid = body.coreid;
			console.log(data);
			// Save raw data for later
		 	var newTag = Tags.insert( data, function(err) {
				if (err) return;
			   	newTagID = data._id;
		 	});
		 	newTag = Tags.findOne(data);
		 	console.log("Got back id" + newTag._id);

		 	// Check to see if the tag is in range of a park
		 	var parkInRange = parkInRangeOfTag({lat: data.lat, lon: data.lon});
		 	console.log(JSON.stringify(newTag));

		 	// Build new amtquest record
		 	var amtquest = {
		 		date: data.createdAt,
		 		lat: data.lat,
		 		lon: data.lon,
		 		tag_id: newTag._id,
		 		deleted: false
		 	};

		 	if (parkInRange) {
		 		// Add specfic info from matched Park
		 		amtquest.name = parkInRange.Name;
		 		amtquest.park_id = parkInRange._id; 
		 	} else {
		 		// Add generic information with no match
		 		amtquest.name = "No match, please help"
		 	}
		 	// Add Amtquest record
		 	Amtquests.insert( amtquest );
		 	result = true;
	  	}
	}

  	if (result) {
  		res.end("AmtquestAPI success for event " + event + "\n");
  	} else {
  		res.end("AmtquestAPI fail for event " + event + "\n");	  		
  	}
  })