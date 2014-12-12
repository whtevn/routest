var q          = require('Q')
  , migrit     = require('migrit')
  , _          = require('underscore')
  ;
function situation(setup, config, deferred){
  this.run_tank = [];
  this.config   = config;
  this.setup    = setup;
  this.deferred = deferred;
}

situation.prototype.query = function(sql){
    return migrit.config
      .then(function(config){
        return migrit.sql.query(sql);
      })
      ;
  }

situation.prototype.fixtures = function(name, database){
  var _this    = this
    ;

  name     = name || 'default';
  database = database || 'testing';

  return migrit.config
    .then(function(config){
      var additive  = false
        , quiet     = true
        ;

    console.log();
      return migrit.importer(config, database, name, additive, quiet);
    })
    .then(function(){
      return migrit.sql
    })
    .catch(function(err){
      console.log(err);
      console.log(err.stack);
    });
}

situation.prototype.before = function(func){
  var deferred = q.defer()
    , _this    = this
    ;
  this.run_tank.push({
    promise: deferred.promise
  , method:  function(res){
     return _this.config.then(function(conf){
       return func(res||conf);
     })
     .then(function(res){
       deferred.resolve(res);
     }); 
    }
  });
  return this;
}

situation.prototype.test = situation.prototype.after = situation.prototype.before;

situation.prototype.run = function(options){
  var deferred = q.defer()
    , _this    = this
    ;
  this.run_tank.push({
    promise: deferred.promise
  , method: function(){
     return _this.config.then(function(config){
      var method  = (_this.setup.method||'get').toLowerCase()
        , tmp_path 
      
      options = options||{}
      tmp_path  = mergeRouteInfo(_this.setup.path, options.route, _this.tmp);
      options.body = (options.body||config.body)
      options.form = (options.form||config.form)
      options.params = (options.params||config.params)
      
      console.log("\n", method.toUpperCase().magenta, config.api.buildRequest(method, tmp_path, options).uri.yellow); 
      return config.api[method](tmp_path, options)
        .then(function(result){
          deferred.resolve(result);
          return(result);
        })
      }); 
    }
  });
  return this;
}

function mergeRouteInfo(path, info, bank){
  info = (info||{});
  _.pairs(info).forEach(function(pair){
    var key = pair[0]
      , val = pair[1]
    if(val.match(/^@tmp\./)){
      val = val.replace(/^@tmp\./, '');
      val = bank[val];
    }
    path = path.replace(":"+key, val);
  })
  return path;
}

situation.prototype.eatAndRun = function(promise){
  var run   = (this.run_tank&&this.run_tank.shift())
    , _this = this
    , deferred = q.defer()
    ;

  if(!promise){
    promise = deferred.promise;
    deferred.resolve();
  }
  if(run){
    return promise.then(function(res){
              return run.method(res);
            })
            .then(function(){
              return _this.eatAndRun(run.promise);
            })
            .catch(function(err){
              console.log(err.message||err);
              console.log(err.stack);
            })
  }else{
    return promise.then(function(){
      // scenario performance report could go here
      //console.log("done eating");
    })
  }
}

module.exports = situation;
