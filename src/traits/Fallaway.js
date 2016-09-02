Engine.traits.Fallaway =
class Fallaway extends Engine.Trait
{
    constructor()
    {
        super();
        this.NAME = 'fallaway';
        this.__requires(Engine.traits.Physics);

        this._countdown = null;
        this._origin = null;

        this.delay = 1;
    }
    __attach(host)
    {
        super.__attach(host);
        this.reset();
    }
    __collides(withObject)
    {
        if (this._countdown === null && withObject.isPlayer) {
            this._countdown = this.delay;
        }
    }
    __timeshift(deltaTime)
    {
        if (this._countdown !== null) {
            this._countdown -= deltaTime;
            if (this._countdown <= 0) {
                this._origin = this._host.position.clone();
                this._host.physics.enable();
                this._countdown = null;
            }
        }
    }
    reset()
    {
        this._host.physics.disable();
        if (this._origin) {
            this._host.position.copy(this._origin);
            this._origin = null;
        }
    }
}
