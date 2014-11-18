var MapObjectManager = require('./MapObjectManager');
var PlaceObjectManager = require('./PlaceObjectManager');
var Transaction = require('./Transaction');
var rsvp = require('rsvp');
var Promise = rsvp.Promise;

function ViewController(){
	var o = {};

	o.init = function(){
		console.log("ViewController::init");

		console.log("Constructing and setting MapObjectManager instance");
		this.mapObjectManager = MapObjectManager.create();

		console.log("Constructing and setting PlaceObjectManager instance");
		this.placeObjectManager = PlaceObjectManager.create();

	};

	o.buttonPress = function(){
		var ll = function(s){
			console.log("ViewController:: " + s);
		}

		ll("buttonPress");

		ll("Creating new transaction to create a new map with 2 new places");
		var tx = Transaction.create();
		ll("Creating a parallel transaction to the first for another scratch pad");
		var txx = Transaction.create();

		ll("Interspersing operations between parallel tx");
		var map = this.mapObjectManager.createMap("My cool map", tx);

		var diffmap = this.mapObjectManager.createMap("Parallel map", txx);
		var diffplace = this.placeObjectManager.createPlace("Parallel place", txx);

		var place = this.placeObjectManager.createPlace("First place", tx);
		var placetwo = this.placeObjectManager.createPlace("Second place", tx);

		// Atomically committing transactions
		// NOTE: This could get ugly, although I'm hoping this architecture will
		// elegantly handle unexpected exceptional scenarios.
		// If tx and txx have contexts that can merge cleanly, no problem here.
		// If tx cannot merge cleanly into txx, I would expect the txx promise to
		// be rejected, indicating that the second transaction failed. I think
		// this would be acceptable and the expected way to cleanly handle it.
		console.log("Atomically committing transactions");

		Transaction.batchCommit([tx, txx]).then(
		function(results){
			console.log("Batch commit succeeded!");
		},
		function(rejectedReason){
			// If any transaction fails, the batch is immediately rejected and
			// we end up here.
			console.log("Batch commit FAILED with reason: " + rejectedReason);
		});

		// NOTE:
		// Probably need a way to close off methods on transactions that can
		// only be called when it's in an open state. You shouldn't be able
		// to pass a closed tx to an objectManager to create a model obj
		// You shouldn't be able to commit a closed tx a second time
		console.log("Trying to create some objects without a tx");
		var map_two = o.mapObjectManager.createMap("RK map");
		var pp = o.placeObjectManager.createPlace("RK place");

	}

	return o;
}

module.exports = ViewController;
