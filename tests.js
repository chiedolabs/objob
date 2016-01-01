/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from './src/objob';

describe('Objob', () => {
  let ob1, ob2, ob3, ob4;
  let obArr1;

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

    obArr1 = [ob1, ob2];

    done();
  });
  describe('expand', () => {
    it('should return the expanded object', (done) => {
      expect(ob(ob(ob3).flatten()).expand()).to.deep.equal(ob3);
      expect(ob(ob(ob2).flatten()).expand()).to.deep.equal(ob2);
      expect(ob(ob(ob4).flatten()).expand()).to.deep.equal(ob4);
      expect(ob(ob(obArr1).flatten()).expand()).to.deep.equal(obArr1);
      done();
    });
  });
});
