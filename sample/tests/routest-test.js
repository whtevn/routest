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

    expect('status code', response.statusCode).toBe(200)
      .because('the call should succeed');

    return db.query("SELECT * FROM users")
      .then(function(result){
        expect('the number of users returned', body.length)
          .toBe('the number in the database', result.length);
        body.forEach(function(user){
          expect(user.first+' '+user.last, user)
            .toBeIn('the database result set', result);
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

    expect("the new user's id", body.id).not().toBeFalsy()
      .because('it should have been set');

    expect("the new user's first name", body.first).toBe('new')
      .because("that is the new user's first name");

    expect("the new user's first name", body.last).toBe('user')
      .because("that is the new user's last name");

    return db.query("SELECT count(*) AS count FROM users")
             .then(function(result){
               expect("the number of current users", result[0].count)
                .toBeGreaterThan('the count taken before the call', test_env.tmp.user_count)
                .because('a new user has been added');;
             });

  })
  .after(function(){
    // be nice and clean up the database if you change it
    return test_env.fixtures();
  })



module.exports = Routest.run()
  .then(function(result){
    db.connection.end();
    return result;
  });
