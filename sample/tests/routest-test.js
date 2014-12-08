var Routest = require('../../routest')
  , db      = Routest.fixtures()
  , expect  = Routest.expect
  ;


Routest
  .setup('pinwheel-galaxy.json'
  , {
      path: "user"
    , method: "POST"
    }
  )
  .run({
    body: {
      name: "user name"
    , age: 37
    }
  })
  .then(function(response){
    return db.query("SELECT * FROM users")
      .then(function(result){
        console.log(result);
        //expect(result.length).toBe(6);
      });
  })
  .then(Routest.end);

