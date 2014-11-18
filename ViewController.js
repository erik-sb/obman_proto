var MapObjectManager = require('./MapObjectManager');

function ViewController(){
	var o = {};

	o.objectManager = MapObjectManager.create();

	o.init = function(){
		console.log("ViewController::init");
		console.log("Constructing and setting MapObjectManager instance");
	};

	o.buttonPress = function(){
		console.log("ViewController::buttonPress")

	}

	return o;
}

module.exports = ViewController;
