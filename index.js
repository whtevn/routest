var httpromise = require('httpromise');
var confoo = require('confoo').find;
var configen = require('configen');
var extend = require('underscore').extend;

function createApi(file, name, methods){
  var route = function() {};
  route.__methods = methods;
  route.__definition = confoo(file)
    .then(function(file){
      conf = configen.generate(file);
      conf.register(new httpromise());
      return conf._
    })
  for(name in methods){
    route = assign_as_method(route, name, methods[name]);
  }
  return route;
}

function assign_as_method(obj, name, route){
  obj.prototype[name] = function(opts){
    var route_path = route.path;
    if(opts && opts.route){
      for(arg in opts.route){
        route_path = route_path.replace(":"+arg, opts.route[arg]);
      }
    }
    var execute = obj.__definition.then(function(api){
      var start = +(new Date());
      return api[route.method.toLowerCase()](route_path, opts).
        then(function(result){
          result.__timer_end   = +(new Date());
          result.__timer_start = start;
          result.__duration = result.__timer_end - result.__timer_start 
          return result
        })
    });

    var result = {
      response: execute.then(function(result){
        return result.body;
      }),
      status_Code: execute.then(function(result){
        return result.statusCode;
      }),
      duration: execute.then(function(result){
        return result.__duration
      }),
      result: execute.then(function(result){
        return {
          response: result.body
        , code: result.statusCode
        , duration: result.__duration
        }
      }),
      refresh: function(opt2){
        extend(opts, opt2 || {})
        return obj.prototype[name](opts);
      }
    }

    result.finished = result.result;

    return result
  }
  return obj
}

module.exports = createApi
