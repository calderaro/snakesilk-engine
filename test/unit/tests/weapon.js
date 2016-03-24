var expect = require('expect.js');
var sinon = require('sinon');

var env = require('../../importer.js');
var Weapon = env.Game.objects.Weapon;
var WeaponTrait = env.Game.traits.Weapon;
var Projectile = env.Game.objects.Projectile;
var Character = env.Game.objects.Character;

describe('Weapon', function() {
  var weapon;
  var worldMock;
  beforeEach(function() {
    worldMock = {
      addObject: sinon.spy(),
      removeObject: sinon.spy(),
    };
    weapon = new Weapon();
    var character = new Character();
    character.world = worldMock;
    character.weapon = new WeaponTrait();
    weapon.setUser(character);
  });

  describe('#fire', function() {
    it('should honor cooldown time', function() {
      weapon.setCoolDown(1);
      expect(weapon.fire()).to.be(true);
      expect(weapon.coolDownDelay).to.equal(weapon.coolDown);
      weapon.timeShift(.9);
      expect(weapon.fire()).to.be(false);
      weapon.timeShift(.1);
      expect(weapon.fire()).to.be(true);
    });
    it('should honor projectile stash', function() {
      var projectile = new Projectile();
      weapon.addProjectile(projectile);
      expect(weapon.fire()).to.be(true);
      weapon.emit(weapon.getProjectile());
      expect(worldMock.addObject.callCount).to.equal(1);
      expect(worldMock.addObject.lastCall.args[0]).to.be(projectile);
      expect(weapon.fire()).to.be(false);
    });
    it('should decrease and honor ammo limit', function() {
      weapon.ammo.max = 10;
      weapon.cost = 1;
      for (var i = 10; i; --i) {
        expect(weapon.fire()).to.be(true);
        expect(weapon.ammo.amount).to.equal(i - 1);
      }
      expect(weapon.fire()).to.be(false);
    });
    it('should trigger ammo change event', function() {
      weapon.ammo.max = 10;
      var callback = sinon.spy();
      weapon.bind(weapon.EVENT_AMMO_CHANGED, callback);
      weapon.fire();
      expect(callback.callCount).to.equal(1);
      expect(callback.lastCall.args[0]).to.be(weapon);
    });
  });
  describe('#emit', function() {
    it('should move projectile from idle to fired pool', function() {
      var projectile = new Projectile();
      weapon.addProjectile(projectile);
      weapon.emit(projectile);
      expect(weapon.projectilesIdle).to.have.length(0);
      expect(weapon.projectilesFired).to.have.length(1);
      expect(weapon.projectilesFired[0]).to.be(projectile);
    });
    it('should set projectile speed according to users aim', function() {
      var projectile = new Projectile();
      projectile.speed = 10;

      weapon.directions[0].set(-1, -1);
      weapon.directions[1].set(1, 1);

      weapon.user.aim.set(1, 1);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(7.071067811865475);
      expect(projectile.velocity.y).to.equal(7.071067811865475);

      weapon.user.aim.set(-1, .5);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(-8.94427190999916);
      expect(projectile.velocity.y).to.equal(4.47213595499958);
    });
    it('should use user horizontal direction for projectile speed if aim is zero', function() {
      var projectile = new Projectile();
      projectile.speed = 10;
      weapon.user.aim.set(0, 0);
      weapon.user.direction.set(1, 0);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(10);
      weapon.user.direction.set(-1, 0);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(-10);
    });
    it('should clamp user aim if weapon aim restricted', function() {
      var projectile = new Projectile();
      projectile.speed = 10;
      weapon.addProjectile(projectile);
      weapon.directions[0].set(-1, 0);
      weapon.directions[1].set(1, 0);
      weapon.user.aim.set(1, 1);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(10);
      weapon.user.aim.set(1, -1);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(10);
      weapon.user.aim.set(-1, 1);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(-10);
      weapon.user.aim.set(-1, -1);
      weapon.emit(projectile);
      expect(projectile.velocity.x).to.equal(-10);
    });
    it('should copy user time stretch to projectile', function() {
      var projectile = new Projectile();
      weapon.user.timeStretch = 1.12451;
      weapon.emit(projectile);
      expect(projectile.timeStretch).to.equal(1.12451);
    });
    it('should set emitter on projectile to weapon user', function() {
      var projectile = new Projectile();
      weapon.emit(projectile);
      expect(projectile.emitter).to.be(weapon.user);
    });
    it('should reset projectile time', function() {
      var projectile = new Projectile();
      projectile.time = 10;
      weapon.emit(projectile);
      expect(projectile.time).to.equal(0);
    });
  });
  describe('#addProjectile', function() {
    it('should add projectile to projectiles list', function() {
      var projectile = new Projectile();
      weapon.addProjectile(projectile);
      expect(weapon.projectiles).to.have.length(1);
      expect(weapon.projectiles[0]).to.be(projectile);
      expect(weapon.projectilesIdle).to.have.length(1);
      expect(weapon.projectilesIdle[0]).to.be(projectile);
      expect(weapon.projectilesFired).to.have.length(0);
    });
  });
  describe('#recycleProjectile', function() {
    it('should move projectile from fired to idle pool', function() {
      var projectile = new Projectile();
      weapon.addProjectile(projectile);
      weapon.emit(projectile);
      weapon.recycleProjectile(projectile);
      expect(weapon.projectilesIdle).to.have.length(1);
      expect(weapon.projectilesIdle[0]).to.be(projectile);
      expect(weapon.projectilesFired).to.have.length(0);
    });
    it('should remove projectile from world', function() {
      var projectile = new Projectile();
      weapon.addProjectile(projectile);
      weapon.emit(projectile);
      weapon.recycleProjectile(projectile);
      expect(worldMock.removeObject.callCount).to.equal(1);
      expect(worldMock.removeObject.lastCall.args[0]).to.be(projectile);
    });
  });
});