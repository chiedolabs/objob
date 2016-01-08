/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('clone', () => {
  let ob1, ob3;

  before((done) => {
    ob1 = {
      name: 'Bob',
      age: 22,
      weight: 170,
      ob: {},
      ob2: {},
      arr: [],
    };

    ob3 = {
      name: 'Bob',
      feet: 5,
      body: {
        feet: {
          toes: 2,
        },
      },
      eyes: [{location: 'left', color: 'blue'}, {location: 'right', color: 'red'}, 1,2],
    };

    done();
  });

  it('should return an object with the correct mapped values', (done) => {
    expect(ob.mapValues(ob1, (x) => x*3)).to.deep.equal({
      name: ob1.name * 3,
      age: ob1.age * 3,
      weight: ob1.weight * 3,
      ob: {},
      ob2: {},
      arr: [],
    });
    expect(ob.mapValues(ob3, (x) => x*3)).to.deep.equal({
      name: NaN,
      feet: 15,
      body: {
        feet: {
          toes: 6,
        },
      },
      eyes: [{location: NaN, color: NaN}, {location: NaN, color: NaN}, 3,6],
    });
    done();
  });

  it('should return an array with the correct mapped values', (done) => {
    expect(ob.mapValues([ob3, ob1], (x) => x*3)).to.deep.equal([{
      name: NaN,
      feet: 15,
      body: {
        feet: {
          toes: 6,
        },
      },
      eyes: [{location: NaN, color: NaN}, {location: NaN, color: NaN}, 3,6],
    },{
      name: ob1.name * 3,
      age: ob1.age * 3,
      weight: ob1.weight * 3,
      ob: {},
      ob2: {},
      arr: [],
    }]);
    done();
  });
});
