/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('clone', () => {
  let ob1, ob2, ob3, ob4;
  let arr2, arr1, arr3, arr4;

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

    ob4 = {
      name: 'Bob',
      feet: 5,
      body: {
        feet: {
          toes: [1,2,10],
          heels: [{number: 1},{number: 7},{number: 8}],
        },
      },
      eyes: [{location: 'left', color: 'blue'}, {location: 'right', color: 'red'}],
    };

    arr1 = [3, 1];
    arr2 = [ob1, ob2];
    arr3 = [arr2, arr2];
    arr4 = [arr2, arr1];

    done();
  });

  it('should return a clone of the object', (done) => {
    expect(ob.clone(ob3)).to.deep.equal(ob3);
    expect(ob.clone(ob3)).to.not.equal(ob3);

    expect(ob.clone(ob2)).to.deep.equal(ob2);
    expect(ob.clone(ob2)).to.not.equal(ob2);

    expect(ob.clone(ob4)).to.deep.equal(ob4);
    expect(ob.clone(ob4)).to.not.equal(ob4);
    done();
  });

  it('should return a clone of the array', (done) => {
    expect(ob.clone(arr4)).to.deep.equal(arr4);
    expect(ob.clone(arr4)).to.not.equal(arr4);
    done();
  });
});
