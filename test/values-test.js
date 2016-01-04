/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('values', () => {
  let ob1, ob2;
  let arr2;

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

    arr2 = [ob1, ob2];
    done();
  });

  it('should return all values for an object', (done) => {
    expect(ob.values(ob1)).to.include.members([ob1.name, ob1.age, ob1.weight]);
    done();
  });
  it('should return all values for an array', (done) => {
    expect(ob.values(arr2)).to.include.members([ob1.name, ob1.age, ob1.weight, ob2.feet]);
    done();
  });
});
