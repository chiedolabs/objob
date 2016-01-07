/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('clone', () => {
  let ob1, ob2, ob3;
  let arr2, arr1;

  before((done) => {
    ob1 = {
      name: 'Bob',
      age: 22,
      weight: 170,
    };

    ob2 = {
      name: 'Bob',
      feet: 5,
      age: 100,
      weight: 170,
    };

    ob3 = {
      name: 'Bob',
      feet: 5,
      body: {
        feet: {
          toes: 2,
        },
      },
      eyes: [{location: 'left', color: 'blue'}, {location: 'right', color: 'red'}],
    };

    arr1 = [3, 1];
    arr2 = [ob1, ob2];

    done();
  });

  it('should return an object with the correct mapped values', (done) => {
    expect(ob.mapValues(ob1, (x) => x*3)).to.deep.equal({
      name: ob1.name * 3,
      age: ob1.age * 3,
      weight: ob1.weight * 3,
    });
    //TODO write more tests
    done();
  });

  it('should return an array with the correct mapped values', (done) => {
    //expect(ob.clone(arr4)).to.deep.equal(arr4);
    //TODO write more tests
    done();
  });
});
