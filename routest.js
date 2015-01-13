var Routest = {}
  , _          = require('underscore')
  , colors     = require('colors')
  , httpromise = require('httpromise')
  , configen   = require('configen')
  , confoo     = require('confoo').find
  , q          = require('Q')
  , situation  = require('./situation')
  ;

Routest.runner = {
  add: function(item){
    this.store.push(item);
    return item
  },
  store: [],
  report: function(item){
    console.log(item.message);
  }
};

Routest.situations = [];

Routest.setup = function(file, setup){
  var sitch
    , config
    , deferred = q.defer()
    ;
  particulars = confoo(file)
    .then(function(file){
      conf = configen.generate(file);
      conf.register(new httpromise());
      return Routest.configen = conf._.then(function(api){
        Routest.api = api;
        return Routest;
      });

      return configen._;
    });
  sitch = new situation(setup, particulars, deferred); 
  Routest.situations.push({
    promise: deferred.promise
  , deferred: deferred
  , situation: sitch
  });
  return sitch
}

Routest.run = function(promise){
  var sitch = Routest.situations.shift()
    , deferred = q.defer()
    ;
  if(!promise){
    promise = deferred.promise;
    deferred.resolve();
  }

  if(sitch){
    return promise
            .then(function(){
              return sitch.situation.eatAndRun()
                .then(function(){
                  sitch.deferred.resolve();
                })
            })
            .then(function(){
              return Routest.run(sitch.promise);
            })
  }else{
    return promise.then(function(){
      return Routest;
      //console.log("that's all folks");
      // whole file report could go here
    })
  }
}

Routest.report = function(){
  var total      = this.runner.store.length
    , successful = _.reject(this.runner.store, function(test){
      return !test.result
    })
    , failing    =  _.reject(this.runner.store, function(test){
      return test.result
    })
    , success = (total == successful.length)
    ;

  console.log("\nResult:".yellow)
  console.log("\t", (total+" tests ran")[success?'green':'red'])
  console.log("\t", (successful.length+" tests successful").green);
  if(failing.length){
    console.log("\t", (failing.length+" tests failed").red);
  }
  Routest.final = {
    total: total
  , succeed: successful.length
  , fail: failing.length
  }
  return Routest;
}

module.exports = Routest;

