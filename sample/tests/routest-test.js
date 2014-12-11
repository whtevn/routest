var Routest = require('../../routest')
  , expect  = Routest.expect
  , test_env
  , db
  ;

test_env = Routest
  .setup('sample-app.json'
  , {
      path: "users"
    , method: "GET"
    }
  )
  .before(function(){
    return test_env.fixtures()
                   .then(function(connection){
                     db = connection
                   });
  })
  

test_env
  .run()
  .test(function(response){
    var body = JSON.parse(response.body);
      ;

    expect(response.statusCode).toBe(200)
      .because('the call should succeed');

    return db.query("SELECT * FROM users")
      .then(function(result){
        expect(body.length).toBe(result.length);
        body.forEach(function(user){
          expect(user).toBeIn(result);
        })
      })
  })

test_env = Routest
  .setup('sample-app.json'
  , {
      path: "users"
    , method: "POST"
    }
  )
  

test_env
  .before(function(){
    test_env.tmp = {}
    return db.query("SELECT count(*) AS count FROM users")
             .then(function(result){
               test_env.tmp.user_count = result[0].count;
             });
  })
  .run({
    body: {
      first: 'new'
    , last: 'user'
    }
  })
  .test(function(response){
    var body = JSON.parse(response.body)
      ;

    expect(body.id).not().toBeFalsy()
      .because('it should have been set');

    expect(body.first).toBe('new')
      .because("that is the new user's first name");

    expect(body.last).toBe('user')
      .because("that is the new user's last name");

    return db.query("SELECT count(*) AS count FROM users")
             .then(function(result){
               expect(result[0].count).toBeGreaterThan(test_env.tmp.user_count)
                .because('a new user has been added');;
             });

  })



Routest.start()
  .then(function(){
    db.connection.end();
  });
