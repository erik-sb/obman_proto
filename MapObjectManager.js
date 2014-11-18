var Promise = require('rsvp').Promise;
var Map = require('./Map');

function _randomMap(){
	return Map("Map:" + Math.floor(Math.random() * 100));
}

var mockDataClient = {
	timeout: 1000,
	successRate: 0.7,
	randomAsyncWork: function(callback){

		var didSucceed = Math.random() < this.successRate;

		startTimeout(function(){

			callback(didSucceed);

		}, this.timeout);

	},

	successAsyncWork: function(callback){
		startTimeout(function(){
			callback();
		}, this.timeout);
	}
}

function MapObjectManager(){
	var o = {};

	//////////////////////////////
	// LOCAL CRUD
	//////////////////////////////
	o.createMap = function(name, tx){
		if(tx){
			console.log("createMap called with tx");
			console.log("createdMap as part of context:", tx.getContext());

			tx.addOperation("Created map " + name);
		} else {
			console.log("createMap called without a tx, defaulting to RK context");
		}

		return Map(name);
	};

	o.readMap = function(id){
		console.log("Reading map using " + _stateToContext(this._currentState));
		return _randomMap();
	}
	// readMaps

	o.updateMap = function(map){
		console.log("Reading map " + map.name + "in " + _stateToContext(this._currentState));
		return map;
	}
	// updateMaps

	o.deleteMap = function(map){
		console.log("Deleting map " + map.name + "in " + _stateToContext(this._currentState));
	}
	// deleteMaps

	//////////////////////////////
	// REMOTE OPS - Network GET, PUT, POST, DELETE
	//////////////////////////////

	// Network loads, which also pump core data
	o.getMap = function(id){
		return new Promise(function(resolve, reject){

			mockDataClient.successAsyncWork(function(){
				resolve(_randomMap());
			});

		});
	}

	o.getMaps = function(ids){
		var maps = [];

		ids.forEach(function(value){
			maps.push(_randomMap());
		});

		return new Promise(function(resolve, reject){

			mockDataClient.successAsyncWork(function(){
				resolve(maps);
			});

		});
	}

	return o;
}

exports.create = function (){ return MapObjectManager(); };
