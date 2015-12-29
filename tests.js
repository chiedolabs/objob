/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from './src/objob';

describe('Objob', () => {
  let ob1;
  let ob2;
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
      weight: 170,
    };

    obArr1 = [ob1, ob2];

    done();
  });

  describe('keys', () => {
    it('should return all keys for an object', (done) => {
      expect(ob(ob1).keys()).to.include.members(['name','age', 'weight']);
      done();
    });
    it('should return all keys for an array', (done) => {
      expect(ob(obArr1).keys()).to.include.members(['name','age', 'weight','feet']);
      done();
    });
  });

  describe('many', () => {
    it('should return the correct number of objects', (done) => {
      expect(ob(ob1).many()).to.deep.equal([ob1,ob1]);
      expect(ob(ob1).many(5)).to.deep.equal([ob1,ob1,ob1,ob1,ob1]);
      done();
    });

    it('should return the array if an array', (done) => {
      expect(ob(obArr1).many()).to.equal(obArr1);
      done();
    });
  });
});
