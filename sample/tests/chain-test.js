var Routest = require('../../routest')
  , expect  = require('../../expect')(Routest.runner)
  ;

expect(5)
  .toBe(5)

expect(5)
  .not.toBe(3)

expect(5)
  .greaterThan(3)

expect(5)
  .nor.toBe(6)

expect(5)
  .lessThan(6)

expect(5)
  .not.greaterThan(6)
  ;

expect(5)
  .not.toBe(3)
  .nor.toBe(6)

expect(5)
  .toBe(5)
  .and.not.toBe(3)
  .nor.toBe(6)
  .and.greaterThan(3)
  .and.lessThan(6)
  .and.not.greaterThan(6)
  .and.not.lessThan(3)
  .and.toBe(5)
  .and.not.not.to.be.greaterThan(3)
  ;
