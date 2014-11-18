var uuid = require('node-uuid');
var rsvp = require('rsvp');
var Promise = rsvp.Promise;


function create(){
	// NOTE: Transactions need a data client refrence to construct their
	// internal contexts as child contexts of the RK MainQueue context
	console.log("Transaction::create");

	var o = {};

	o._contextId = uuid.v4();
	console.log("Constructed new child ManagedObjectContext:", o._contextId);
	o._ops = [];

	o.addOperation = function(op){
		o._ops.push(op);
	};

	o.getContext = function(){
		return this._contextId;
	};

	o.commit = function(){
		// This will need to be a context wide save of some kind,
		// or some way to commit the various operations that have
		// been a part of this transaction.
		// Commits should be persisted all the way to the persistance store,
		// so the objects will need to make their way up the core data stack.
		// I would expect commited transaction state to reflect in any other
		// context in the stack from this point on.
		console.log("===");
		console.log(" Committed Transaction with context:", this._contextId);
		console.log("===");
		console.log("Operations: ");
		this._ops.map(function(val){ console.log(val); });
		console.log("===");

		var self = this;
		return new Promise(function(resolve, reject){
			// We've considered this may possibly return a promise if commits have
			// any element of a asynchronicity to be controlled
			setTimeout(function(){
				if(Math.random() > .2){
					console.log("Successfully committed " + self._contextId);
					resolve({ id: o._contextId });
				} else {
					console.log("Failed to commit " + self._contextId);
					reject("Blame " + self._contextId);
				}

			}, 1000);
		});

	};

	return o;
}

function batchCommit(transactions){
	console.log("Attempting batch commit..");

	return rsvp.all(
		transactions.map(function(tx){ return tx.commit(); })
	);

}

exports.create = create;
exports.batchCommit = batchCommit;
