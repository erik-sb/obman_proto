var Promise = require('rsvp').Promise;

// Obviously this is weird, but they are functionally the same object at this point
var Place = require('./Map');

function _randomPlace(){
	return ("Place:" + Math.floor(Math.random() * 100));
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

function PlaceObjectManager(){
	var o = {};

	//////////////////////////////
	// LOCAL CRUD
	//////////////////////////////
	o.createPlace = function(name, tx){
		if(tx){
			console.log("createPlace called with tx");
			console.log("createdPlace as part of context:", tx.getContext());

			tx.addOperation("Created place " + name);
		} else {
			console.log("createPlace called without a tx, defaulting to RK context");
		}

		return Place(name);
	};

	o.readPlace = function(id){
		console.log("Reading place using " + _stateToContext(this._currentState));
		return _randomPlace();
	}
	// readPlaces

	o.updatePlace = function(place){
		console.log("Reading place " + place.name + "in " + _stateToContext(this._currentState));
		return place;
	}
	// updatePlaces

	o.deletePlace = function(place){
		console.log("Deleting place " + place.name + "in " + _stateToContext(this._currentState));
	}
	// deletePlaces

	//////////////////////////////
	// REMOTE OPS - Network GET, PUT, POST, DELETE
	//////////////////////////////

	// Network loads, which also pump core data
	o.getPlace = function(id){
		return new Promise(function(resolve, reject){

			mockDataClient.successAsyncWork(function(){
				resolve(_randomPlace());
			});

		});
	}

	o.getPlaces = function(ids){
		var places = [];

		ids.forEach(function(value){
			places.push(_randomPlace());
		});

		return new Promise(function(resolve, reject){

			mockDataClient.successAsyncWork(function(){
				resolve(places);
			});

		});
	}

	return o;
}

exports.create = function (){ return PlaceObjectManager(); };
