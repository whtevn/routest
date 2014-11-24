var Routest = {}

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

module.exports = Routest;


