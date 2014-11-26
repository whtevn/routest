var Routest = require('../../routest')
  , expect = Routest.expect
  ;

expect(true)
  .toBe(false)
  .because('true should not be false. failed to show failures.');

expect(true)
  .not()
  .toBe(false)
  .because('true should not be false');

expect(3).toEqual(3);

expect(false)
  .not()
  .toBe(undefined)
  .because("they just aren't the same thing");

expect(false)
  .not()
  .toBe(undefined);

expect(3).toEqual(3);
expect([]).toEqual('');
