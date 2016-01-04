/* eslint max-nested-callbacks: 0*/
/* eslint no-undef: 0*/
import { expect } from 'chai';
import ob from '../src/objob';

describe('filter', () => {
  let ob5;

  before((done) => {
    ob5 = {
      name: undefined,
      feet: 5,
      body: {
        feet: {
          toes: [undefined,2,10],
        },
        hair: undefined,
      },
    };
    done();
  });

  it('should return an object with undefineds filtered out', (done) => {
    expect(ob.filter(ob5, (x) => x !== undefined)).to.deep.equal({
      feet: ob5.feet,
      body: {
        feet: {
          toes: [2,10],
        },
      },
    });

    done();
  });
});
