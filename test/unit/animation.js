'use strict';

const expect = require('expect.js');
const sinon = require('sinon');

const env = require('../env');
const Animation = env.Engine.Animator.Animation;
const Timeline = env.Engine.Timeline;

describe('Animation', () => {
  describe('on instantiation', () => {
    let animation;
    before(() => {
      animation = new Animation('foo');
    });

    it('has length 0', () => {
      expect(animation.length).to.be(0);
    });

    it('honors id in constructor', () => {
      expect(animation.id).to.be('foo');
    });

    it('has no group set', () => {
      expect(animation.group).to.be(null);
    });
  });

  describe('when instantiated', () => {
    let animation;
    beforeEach(() => {
      animation = new Animation('foo');
    });

    describe('#addFrame()', () => {
      describe('when called first', () => {
        beforeEach(() => {
          animation.addFrame('A', 1.13);
        });

        it('does not instantiate a timeline', () => {
          expect(animation.timeline).to.be(null);
        });

        describe('#getIndex()', () => {
          it('returns 0 for any input', () => {
            expect(animation.getIndex(1)).to.be(0);
            expect(animation.getIndex(0)).to.be(0);
            expect(animation.getIndex(12515212)).to.be(0);
          });
        });

        describe('#getValue()', () => {
          it('returns only value for any input', () => {
            expect(animation.getValue(0)).to.be('A');
            expect(animation.getValue(1)).to.be('A');
          });
        });

        describe('and then when called again', () => {
          beforeEach(() => {
            animation.addFrame('B', 1.31);
          });

          it('instantiates a timeline', () => {
            expect(animation.timeline).to.be.a(Timeline);
          });

          describe('#getIndex()', () => {
            it('returns 0 for time < 1.13', () => {
              expect(animation.getIndex(1)).to.be(0);
              expect(animation.getIndex(0)).to.be(0);
              expect(animation.getIndex(1.12999999)).to.be(0);
            });

            it('returns 1 for time >= 1.13 but less than 2.44', () => {
              expect(animation.getIndex(1.13)).to.be(1);
              expect(animation.getIndex(2.43)).to.be(1);
            });

            it('returns 0 for time > 2.43', () => {
              expect(animation.getIndex(2.44)).to.be(0);
            });
          });

          describe('#getValue()', () => {
            it('returns correct value for index 0', () => {
              expect(animation.getValue(0)).to.be('A');
            });

            it('returns correct value for index 1', () => {
              expect(animation.getValue(1)).to.be('B');
            });
          });
        });
      });


    });

  });
});
