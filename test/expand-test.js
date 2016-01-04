/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('expand', () => {
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

  it('should return the expanded object', (done) => {
    expect(ob.expand(ob.flatten(ob3))).to.deep.equal(ob3);
    expect(ob.expand(ob.flatten(ob2))).to.deep.equal(ob2);
    expect(ob.expand(ob.flatten(ob4))).to.deep.equal(ob4);
    expect(ob.expand(ob.flatten(arr2))).to.deep.equal(arr2);
    expect(ob.expand(ob.flatten(arr1))).to.deep.equal(arr1);
    expect(ob.expand(ob.flatten(arr3))).to.deep.equal(arr3);
    expect(ob.expand(ob.flatten(arr4))).to.deep.equal(arr4);
    expect(ob.expand(ob.flatten({tmp: arr4}))).to.deep.equal({tmp: arr4});
    done();
  });
});
