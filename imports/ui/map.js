import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating';
import { Amtquests } from '../api/amtquests.js';
import { Parks } from '../api/parks.js';

import './amtquest.html';
import './marker.html';
import './park.html'
 
var map, openStreetMaps, markers = {}, parksGroup, amtquestsGroup, setLocationAlready = false, lastLocation = null;

Template.map.rendered = function() {
	var self = this;

	var setLatestAmtquestLocation = function(data) {
		var questLink = getParameterByName("amtquest");
		var setLocation = undefined;
		if (questLink) {
			var setLocation = Amtquests.findOne({deleted: false, _id: questLink});
		}
		if (!setLocation) {
			setLocation = Amtquests.findOne({deleted: false}, {sort: {date: 'dec'}});
			if (setLocation) {
				if (history.pushState) {
					var stateObject = { dummy: true };
				    var url = window.location.protocol
				        + "//"
				        + window.location.host
				        + window.location.pathname;
			    	history.pushState(stateObject, jQuery(document).find('title').text(), url);
			    }
			}
		}
		if (setLocation) {
			map.setView([setLocation.lat, setLocation.lon], 15);
		}
	};

	if (map) { 
		map.off();
		map.remove();
	};

	L.Icon.Default.imagePath = '/images/';

	openStreetMaps = L.tileLayer.provider('OpenStreetMap.Mapnik');

	parksGroup = L.layerGroup([]);

	amtquestsGroup = L.layerGroup([]);

	var baseMaps = {
	    "Map": openStreetMaps
	};

	var overlayMaps = {
	    "Amtquests": amtquestsGroup,
    	"All Parks": parksGroup
	};

	if (!lastLocation) {
		lastLocation = [45.3710562, -75.695975];
	}

	map = L.map('map', {
			doubleClickZoom: false,
			layers: [openStreetMaps, amtquestsGroup]
		}).setView(lastLocation, 15);
	mapGlobal = map;
	map.zoomControl.setPosition('bottomleft');

	L.control.layers(baseMaps, overlayMaps, {position: 'bottomright'}).addTo(map);

	var controlSearch = new L.Control.Search({
		position:'topleft',
		textPlaceholder: 'Amtgard Park',
		collapsed: false,
		textErr: 'No park found',
		layer: parksGroup,
		initial: false,
		zoom: 16,
		marker: false,
		firstTipSubmit: true,
		minLength: 3
	});
	map.addControl( controlSearch );

	map.addControl( new L.Control.Search({
			position:'topright',		
			collapsed: false,
			textPlaceholder: 'City Search',
			sourceData: googleGeocoding,
			formatData: formatJSON,
			markerLocation: false,
			zoom: 10,
			collapsed: true,
			autoCollapse: true,
			minLength: 2,
			moveToLocation: movedTo
		})
	);
	this.state = new ReactiveDict();

    var shireIcon = L.icon({
        iconUrl: 'images/shire.svg',
        iconSize: [15, 15], // size of the icon
        });

    var baronyIcon = L.icon({
        iconUrl: 'images/barony.svg',
        iconSize: [18, 18], // size of the icon
        });

    var duchyIcon = L.icon({
        iconUrl: 'images/duchy.svg',
        iconSize: [20, 20], // size of the icon
        });

    var amtquestCheckIcon = L.icon({
        iconUrl: 'images/chest-checkmark.png',
        iconSize: [20, 20], // size of the icon
        });

    var amtquestAddIcon = L.icon({
        iconUrl: 'images/chest-add.png',
        iconSize: [20, 20], // size of the icon
        });

	Amtquests.find({deleted: false}).observe({
		added: function(amtquest) {
			var iconType = null;
			if (amtquest.name === 'No match, please help') {
				iconType = amtquestAddIcon;
			} else {
				iconType = amtquestCheckIcon;
			}

			var marker = new L.Marker([amtquest.lat, amtquest.lon], {
				_id: amtquest._id,
				name: amtquest._id,
				icon: iconType
			}).on('click', function(e) {
			});
			// wrapping node for bindPopup
		    var markerNode = document.createElement('div');
		    markerNode.setAttribute("class", "marker")
		    // Which template to use for the popup? Some data for it, and attach it to node
		    Blaze.renderWithData(Template.amtquest, amtquest, markerNode);
		    // Finally bind the markerNode to the popup
		    marker.bindPopup(markerNode);

			amtquestsGroup.addLayer(marker);
			markers[marker.options._id] = marker;
		},
		removed: function(amtquest) {
			map.removeLayer(markers[amtquest._id]);
			delete markers[amtquest._id];
		},
		changed: function(amtquest) {
			marker = markers[amtquest._id];
			marker.setLatLng([amtquest.lat, amtquest.lon]);
			// wrapping node for bindPopup
		    var markerNode = document.createElement('div');
		    markerNode.setAttribute("class", "marker")
		    // Which template to use for the popup? Some data for it, and attach it to node
		    Blaze.renderWithData(Template.amtquest, amtquest, markerNode);
		    // Finally bind the markerNode to the popup
		    marker.bindPopup(markerNode);
		}
	});

	Parks.find({Active: true}).observe({
		added: function(park) {
			if (park.Location && park.Location.location) {
				var iconType = null;
				switch (park.Title) {
					case "Duchy": 
						iconType = duchyIcon;
						break;
					case "Barony":
						iconType = baronyIcon;
						break;
					default:
						iconType = shireIcon;
				};
				var marker = new L.Marker([park.Location.location.lat, park.Location.location.lng], {
					_id: park._id,
					icon: iconType,
					title: park.Name
				}).on('click', function(e) {
				    // Which template to use for the popup? Some data for it, and attach it to node
				    if (markerNode.childElementCount === 0) {
					    Blaze.renderWithData(Template.park, park, markerNode);
					}
				});
				// wrapping node for bindPopup
			    var markerNode = document.createElement('div');
			    markerNode.setAttribute("class", "marker")
			    // Finally bind the markerNode to the popup
			    marker.bindPopup(markerNode);

				parksGroup.addLayer(marker);
				markers[marker.options._id] = marker;
			}
		},
		removed: function(park) {
			map.removeLayer(markers[park._id]);
			delete markers[park._id];
		},
		changed: function(park) {
			marker = markers[park._id];
			marker.setLatLng([park.Location.location.lat, park.Location.location.lng]);
		}
	});

	Meteor.subscribe('amtquests', setLatestAmtquestLocation);

	// if (!setLocationAlready) {
	// 	setLocationAlready = true;
	// 	getLocation(setUserLocation);
	// }
}

Template.map.helpers({
  amtquests(search) {
    return Amtquests.find({search});
  },
  parks(search) {
  	return Parks.find({search});
  },
  setPosition(lat, lng) {
  	map.setView(lat, lng);
  }
});


Template.map.created = function() {
	// this.state = new ReactiveDict();

 //    var shireIcon = L.icon({
 //        iconUrl: 'images/shire.svg',
 //        iconSize: [15, 15], // size of the icon
 //        });

 //    var baronyIcon = L.icon({
 //        iconUrl: 'images/barony.svg',
 //        iconSize: [18, 18], // size of the icon
 //        });

 //    var duchyIcon = L.icon({
 //        iconUrl: 'images/duchy.svg',
 //        iconSize: [20, 20], // size of the icon
 //        });

 //    var amtquestCheckIcon = L.icon({
 //        iconUrl: 'images/chest-checkmark.png',
 //        iconSize: [20, 20], // size of the icon
 //        });

 //    var amtquestAddIcon = L.icon({
 //        iconUrl: 'images/chest-add.png',
 //        iconSize: [20, 20], // size of the icon
 //        });

	// Amtquests.find({deleted: false}).observe({
	// 	added: function(amtquest) {
	// 		var iconType = null;
	// 		if (amtquest.name === 'No match, please help') {
	// 			iconType = amtquestAddIcon;
	// 		} else {
	// 			iconType = amtquestCheckIcon;
	// 		}

	// 		var marker = new L.Marker([amtquest.lat, amtquest.lon], {
	// 			_id: amtquest._id,
	// 			name: amtquest._id,
	// 			icon: iconType
	// 		}).on('click', function(e) {
	// 		});
	// 		// wrapping node for bindPopup
	// 	    var markerNode = document.createElement('div');
	// 	    markerNode.setAttribute("class", "marker")
	// 	    // Which template to use for the popup? Some data for it, and attach it to node
	// 	    Blaze.renderWithData(Template.amtquest, amtquest, markerNode);
	// 	    // Finally bind the markerNode to the popup
	// 	    marker.bindPopup(markerNode);

	// 		amtquestsGroup.addLayer(marker);
	// 		markers[marker.options._id] = marker;
	// 	},
	// 	removed: function(amtquest) {
	// 		map.removeLayer(markers[amtquest._id]);
	// 		delete markers[amtquest._id];
	// 	},
	// 	changed: function(amtquest) {
	// 		marker = markers[amtquest._id];
	// 		marker.setLatLng([amtquest.lat, amtquest.lon]);
	// 		// wrapping node for bindPopup
	// 	    var markerNode = document.createElement('div');
	// 	    markerNode.setAttribute("class", "marker")
	// 	    // Which template to use for the popup? Some data for it, and attach it to node
	// 	    Blaze.renderWithData(Template.amtquest, amtquest, markerNode);
	// 	    // Finally bind the markerNode to the popup
	// 	    marker.bindPopup(markerNode);
	// 	}
	// });

	// Parks.find({Active: true}).observe({
	// 	added: function(park) {
	// 		if (park.Location && park.Location.location) {
	// 			var iconType = null;
	// 			switch (park.Title) {
	// 				case "Duchy": 
	// 					iconType = duchyIcon;
	// 					break;
	// 				case "Barony":
	// 					iconType = baronyIcon;
	// 					break;
	// 				default:
	// 					iconType = shireIcon;
	// 			};
	// 			var marker = new L.Marker([park.Location.location.lat, park.Location.location.lng], {
	// 				_id: park._id,
	// 				icon: iconType,
	// 				title: park.Name
	// 			}).on('click', function(e) {
	// 			    // Which template to use for the popup? Some data for it, and attach it to node
	// 			    if (markerNode.childElementCount === 0) {
	// 				    Blaze.renderWithData(Template.park, park, markerNode);
	// 				}
	// 			});
	// 			// wrapping node for bindPopup
	// 		    var markerNode = document.createElement('div');
	// 		    markerNode.setAttribute("class", "marker")
	// 		    // Finally bind the markerNode to the popup
	// 		    marker.bindPopup(markerNode);

	// 			parksGroup.addLayer(marker);
	// 			markers[marker.options._id] = marker;
	// 		}
	// 	},
	// 	removed: function(park) {
	// 		map.removeLayer(markers[park._id]);
	// 		delete markers[park._id];
	// 	},
	// 	changed: function(park) {
	// 		marker = markers[park._id];
	// 		marker.setLatLng([park.Location.location.lat, park.Location.location.lng]);
	// 	}
	// });
}

var geocoder = new google.maps.Geocoder();

function googleGeocoding(text, callResponse) {
	geocoder.geocode({address: text}, callResponse);
}

function formatJSON(rawjson) {
	var json = {},
		key, loc, disp = [];
	for(var i in rawjson)
	{
		key = rawjson[i].formatted_address;
		
		loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );
		
		json[ key ]= loc;	//key,value format
	}
	return json;
}

function movedTo(latlng) { console.log("Said go to latlng " + latlng); }
