var Routest = require('../../../routest')
  , expect  = require('../../../expect')(Routest.runner)
  ;
expect(5)
  .not.toBe(5)

expect(5)
  .toBe(3)

expect(5)
  .not.greaterThan(3)

expect(5)
  .toBe(6)

expect(5)
  .not.lessThan(6)

expect(5)
  .greaterThan(6)
  ;

expect(5)
  .toBe(3)
  .toBe(6)

expect(5)
  .not.not.toBe(3)
  .not.nor.toBe(6)
  .not.and.greaterThan(3)
  .not.and.lessThan(6)
  .not.and.not.greaterThan(6)
  .not.and.not.lessThan(3)
  .not.and.toBe(5)
  .not.and.not.not.to.be.greaterThan(3)
  ;
