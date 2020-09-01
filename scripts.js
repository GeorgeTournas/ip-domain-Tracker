// DOM nodes
var input = document.querySelector('.input-group-field');
var submitButton = document.querySelector('.input-group-button');
var ipBlock = document.querySelector('#ip');
var locationBlock = document.querySelector('#location');
var timezoneBlock = document.querySelector('#timezone');
var ispBlock = document.querySelector('#isp');
var myIcon = L.icon({
	iconUrl: './images/icon-location.svg',
	//iconSize: [38, 95],
	iconAnchor: [22, 94],
});

// Map
var mymap = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution:
		'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1,
	accessToken: 'pk.eyJ1IjoiZ2VvdG91ciIsImEiOiJja2VpeWQ5NXEwcDh2MzBtdWxxcG10M2MxIn0.Q8jcsOmHjwIO4SMCylgrtA',
}).addTo(mymap);

//function to distinguish between ip/domain
function checkRequestType() {
	var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	var domainRegex = /^([a-zA-Z0-9]([-a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)?([a-zA-Z0-9]{1,2}([-a-zA-Z0-9]{0,252}[a-zA-Z0-9])?)\.([a-zA-Z]{2,63})$/;
	if (input.value && ipRegex.test(input.value)) {
		return { type: 'ipAddress', data: input.value };
	} else if (input.value && domainRegex.test(input.value)) {
		return { type: 'domain', data: input.value };
	}

	return { type: 'ipAddress', data: '' };
}

// function to get user's ip || domain
async function getIP() {
	var dataElaments = document.querySelectorAll('.result');
	for (var i = 0; i < dataElaments.length; i++) {
		dataElaments[i].classList.add('hide');
	}
	//document.getElementsByClassName('result').classList.add('hide');
	document.querySelector('.loader').classList.add('show');
	var requestOptions = checkRequestType();

	var request = await fetch(
		'https://geo.ipify.org/api/v1?apiKey=at_KCoWYQohg1HefQFa23gM4Od9KMCZX&' + requestOptions.type + '=' + requestOptions.data,
	);
	var result = await request.json();
	for (var i = 0; i < dataElaments.length; i++) {
		dataElaments[i].classList.remove('hide');
	}
	document.querySelector('.loader').classList.remove('show');
	var marker = L.marker([result.location.lat, result.location.lng], { icon: myIcon });
	input.value = '';
	ipBlock.innerHTML = result.ip;
	locationBlock.innerHTML = result.location.city + ', ' + result.location.region + ' ' + result.location.postalCode;
	timezoneBlock.innerHTML = result.location.timezone;
	ispBlock.innerHTML = result.isp;
	mymap.setView([result.location.lat, result.location.lng]);
	marker.addTo(mymap);
}

// submit ip || domain
submitButton.addEventListener(
	'click',
	function () {
		getIP();
	},
	false,
);

input.addEventListener('keyup', function (event) {
	if (event.keyCode === 13) getIP();
});

getIP();
