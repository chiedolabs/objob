/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('equals', () => {
  let ob1, ob2, ob3;

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
    done();
  });

  it('should return true if the objects are equal', (done) => {
    expect(ob.equals(ob1, ob.clone(ob1))).to.be.true;
    expect(ob.equals(ob2, ob.clone(ob2))).to.be.true;
    expect(ob.equals(ob3, ob.clone(ob3))).to.be.true;
    expect(ob.equals({'three': ob3, 'two': ob2}, ob.clone({'three': ob3, 'two': ob2}))).to.be.true;
    done();
  });

  it('should return true if the arrays are equal', (done) => {
    expect(ob.equals([[ob1]], ob.clone([[ob1]]))).to.be.true;
    expect(ob.equals([ob2], ob.clone([ob2]))).to.be.true;
    expect(ob.equals([[[ob3]]], ob.clone([[[ob3]]]))).to.be.true;
    expect(ob.equals([[[ob3, ob1]]], ob.clone([[[ob3, ob1]]]))).to.be.true;
    done();
  });

  it('should return false if the objects are not equal', (done) => {
    expect(ob.equals({'ob3': ob3}, ob.clone(ob3))).to.be.false;
    expect(ob.equals({test: ob3}, ob.clone(ob3))).to.be.false;
    done();
  });

  it('should return false if the arrays are not equal', (done) => {
    expect(ob.equals([[ob3]], ob.clone([[[ob3]]]))).to.be.false;
    expect(ob.equals([[ob3,ob3]], ob.clone([[[ob3, ob3]]]))).to.be.false;
    done();
  });
});
