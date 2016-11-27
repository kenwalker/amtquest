mapGlobal = null;
userLocation = null;
doNotShowMenu = false;

toggleClass = function(element, className) {
	var classes = element.className.split(/\s+/),
	  length = classes.length,
	  i = 0;

	for(; i < length; i++) {
		if (classes[i] === className) {
		  classes.splice(i, 1);
		  break;
		}
	}
	// The className is not found
	if (length === classes.length) {
		classes.push(className);
	}

	element.className = classes.join(' ');
}

toggleAll = function(e) {
	var active = 'active';

	e.preventDefault();
	toggleClass(layout, active);
	toggleClass(menu, active);
	toggleClass(menuLink, active);
}

hookContentMenuToggle = function() {
	content  = document.getElementById('main');
	content.onclick = function(e) {
		if (menu.className.indexOf('active') !== -1) {
			toggleAll(e);
		}
	};
}

getLocation = function(functionToCall) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(functionToCall);
    }
}

// If you want to see the errors add this as a second parameter to getCurrentPosition above
showLocationError = function(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}

getParameterByName = function(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
