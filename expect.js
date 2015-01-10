var _      = require('underscore')
  , colors = require('colors')
  ;

function Expectation(description, value, not){
  this.original = determineValueOf(description, value);
  this.oppositeDay = false;

  if(!not){
    this.not = new Expectation(description, value, this);
    this.not.oppositeDay = true; 
  }else{
    this.not = not;
  }

  this.to = this.be = this;

  this.testValue  = {};
}

Expectation.prototype.toBe = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be"
  return ((description||value)&&this.execute(this.testValue.value === this.original.value)||this);
}

Expectation.prototype.greaterThan = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be greater than";
  return this.execute(this.original.value > this.testValue.value );
}

Expectation.prototype.lessThan = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to be less than";
  return this.execute(this.original.value < this.testValue.value );
}

Expectation.prototype.foundIn = function(description, value){
  var haystack 
    , needle  
    ;

  this.testValue = determineValueOf(description, value); 
  this.verb = "to be in";

  haystack = this.testValue.value.map(JSON.stringify);
  needle   = JSON.stringify(this.original.value);
  return this.execute(haystack.indexOf(needle) > -1);
}

Expectation.prototype.exist = function(description){
  this.silenceOriginal = true;
  this.testValue.description = description;
  this.verb = "to exist";
  return this.execute(this.original.value);
}

Expectation.prototype.empty = function(description){
  this.silenceOriginal = true;
  this.testValue.description = description;
  this.verb = "to be empty";
  return this.execute(this.original.value.length === 0);
}

Expectation.prototype.equal = function(description, value){
  this.testValue = determineValueOf(description, value); 
  this.verb = "to equal";
  return this.execute(this.testValue.value == this.original.value);
}

Expectation.prototype.length = function(description, value){
}
Expectation.prototype.contain = function(description, value){
}
Expectation.prototype.containLike = function(description, value){
}
Expectation.prototype.haveSet = function(){
}
Expectation.prototype.unique = function(){
}

// expect(ray).each().to.haveSet('batch_id')
Expectation.prototype.each = function(){
  this.original.value.forEach(function(item){
    // run the experiment, do not print the result
    // check the result
    // maintain true once found
  });
}

Expectation.prototype.one = function(){
}
Expectation.prototype.n = function(){
}

Expectation.prototype.execute = function(testResult){
  this.result  = testResult;
  this.message = message( this.original
                        , this.testValue
                        , this.result
                        , this.verb
                        , this.oppositeDay
                        , this.silenceOriginal
                        );
  console.log(this.message);
  return this;
}

Expectation.prototype.because = function(explanation){
  this.explanation = explanation;
}


function message(original, testValue, result, verb, oppositeDay, silenceOriginal){
  var announceOppositeDay='';
  if(oppositeDay){
    result = !result;
    announceOppositeDay='not ';
  }

  msg = "expected "+(original.description||JSON.stringify(original.value))+" "+announceOppositeDay+verb;
  
  if(!silenceOriginal){
  msg +=" "+((result && testValue.description)||JSON.stringify(testValue.value));
  }

  if(!result){
    msg += " but got "+JSON.stringify(original.value);
  }
  msg = msg[result?'green':'red'];
  return msg
}

function determineValueOf(description, value){
  var result
    ;

  if(value === undefined){
    value = description;
    description = undefined; 
  }

  return {
    value: value
  , description: description
  }
}

module.exports = function(runner){
  return function(description, value){
    return runner.add(new Expectation(description, value));
  }
}
