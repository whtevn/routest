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
    console.log(item);
    this.store.push(item);
    return item
  },
  store: []
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
    promise.then(function(){
      //console.log("that's all folks");
      // whole file report could go here
    })
  }
}

module.exports = Routest;

