Engine.objects.characters.Heatman = function()
{
    Engine.Entity.call(this);

    this.flameTransformDuration = .09;
    this.flameTransformTime = 0;
}

Engine.Util.extend(Engine.objects.characters.Heatman,
                   Engine.Entity);

Engine.objects.characters.Heatman.prototype.routeAnimation = function()
{
    if (this.move._interimSpeed) {
        if (this.flameTransformTime < this.flameTransformDuration) {
            this.flameTransformTime += this.deltaTime;
            return 'toFlame';
        }
        this.flameTransformTime = this.flameTransformDuration;
        return 'flame';
    }
    else {
        if (this.isFiring) {
            return 'fire';
        }

        if (!this.jump._ready) {
            return 'jump';
        }

        if (this.isInvincible) {
            return 'burn';
        }
        if (this.flameTransformTime > 0) {
            this.flameTransformTime -= this.deltaTime;
            return 'fromFlame';
        }
        this.flameTransformTime = 0;
        return 'idle';
    }
}

Engine.objects.characters.Heatman.prototype.timeShift = function(dt)
{
    if (this.move._walkSpeed === 0) {
        this.health.immune = false;
    }
    else {
        this.health.immune = true;
    }

    Engine.Entity.prototype.timeShift.call(this, dt);
}
