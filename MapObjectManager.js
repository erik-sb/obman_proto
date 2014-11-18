var Promise = require('rsvp').Promise;
var Map = require('./Map');

var states = {
	CLOSED: 0,
	OPEN: 1
}

function _randomMap(){
	return Map("Map:" + Math.floor(Math.random() * 100));
}

function _stateToContextName(state){
	return state === states.CLOSED ? "RK Context" : "Private Context";
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

	o._context = null;
	o._currentState = states.CLOSED;

	//////////////////////////////
	// TRANSACTIONS
	//////////////////////////////
	o.startTransaction = function(){
		if(!this._context){
			console.log("Opening new transaction");

			o._context = [];

		} else {
			console.log("WARNING: Attempted to open a new transaction when one is already open. Returning null.");
			return null;
		}
	}

	o.abortTransaction = function(){
		if(o._currentState = states.OPEN){
			console.log("WARNING: No open transactions to abort.")
		} else {
			console.log("Aborting open transaction");
			o._context = null;
			o._currentState = states.CLOSED;
		}
	}

	o.commitTransaction = function(){
		return Promise(function(resolve, reject){

			// Mocking some random work that may succeed or fail
			mockDataClient.randomAsyncWork(function(didSucceed){

				if(didSucceed){
					resolve(_randomMap());
				} else {
					reject("No network cx");
				}

			})

		});
	}

	//////////////////////////////
	// LOCAL CRUD
	//////////////////////////////
	o.createMap = function(name){
		console.log("Creating context in " + _stateToContext(this._currentState));
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

}

exports.create = function (){ return MapObjectManager(); };
exports.states = states;
