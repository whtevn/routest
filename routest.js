var Routest = {}
  , colors = require('colors');
  ;


function expectations(original, opposite){
  var result
    ;
  return {
    toEqual: function(item){
      if(opposite){
        result = (item != original);
      }else{
        result = (item == original);
      }
      return message(original, item, result);
    }
  , toBe: function(item){
      if(opposite){
        result = (item !== original);
      }else{
        result = (item === original);
      }
      return message(original, item, result, opposite);
    }
  , not: function(){
      return expectations(original, true);
    }
  } 
}

function message(original, item, result, opposite){
  var result
    ;
  original = mungeItemForMessage(original);
  item = mungeItemForMessage(item);
  if(opposite){
    msg = 'expected '+original+' not to be '+item+', '+(result?'and it was not':'but it was');
  }else{
    msg = 'expected '+original+' '+(result?'and':'but')+' got '+ item;
  }
  console.log();
  console.log(msg[result?'green':'red']);
  return {
    because: function(msg){
      var modifier = result?'succeeded: ':'failed: ';
      msg = modifier+msg
      msg = msg[result?'green':'red'];
      console.log(msg);
    }
  }
}

function mungeItemForMessage(item){
  if(typeof item == 'object'){
    item = JSON.stringify(item);
  }
  return "'"+item+"'"
}

Routest.setup = function(setup){
  Routest.config = setup;
  Routest.config.conditions = (Routest.config.conditions||{});
}

Routest.run = function(setup){
  setup = _.merge(Routest.config.conditions, setup);
  setup.route = mangleRoute(setup.route, setup.conditions);
  // make api call based on Routest.config
  // return a promise with the api call response
  // and a hook to mess with the database
}

Routest.expect = function(item){
  return expectations(item); 
}

module.exports = Routest;

