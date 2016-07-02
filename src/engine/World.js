'use strict';

Engine.World =
class World
{
    constructor()
    {
        this.EVENT_UPDATE = 'update';
        this.EVENT_EMIT_AUDIO = 'emit-audio';

        this.ambientLight = new THREE.AmbientLight(0xffffff);

        this.collision = new Engine.Collision();

        this.events = new Engine.Events(this);

        this.atmosphericDensity = .1;
        this.atmosphericViscosity = .1;
        this.gravityForce = new THREE.Vector2(0, 9.81);
        this.windForce = new THREE.Vector2(0, 0);

        this.objects = [];
        this.objectsDead = [];

        this.scene = new THREE.Scene();
        this.scene.add(this.ambientLight);

        this.timeStretch = 1;
        this.timeTotal = 0;
    }
    addObject(object)
    {
        if (object instanceof Engine.Object === false) {
            throw new TypeError('Invalid object');
        }
        if (this.hasObject(object)) {
            return;
        }

        this.objects.push(object);
        this.objectsDead.push(false);
        this.collision.addObject(object);
        if (object.model) {
            this.scene.add(object.model);
        }
        object.setWorld(this);
    }
    emitAudio(positionalAudio)
    {
        this.events.trigger(this.EVENT_EMIT_AUDIO, [positionalAudio]);
    }
    getObject(id)
    {
        for (let i = 0, l = this.objects.length; i !== l; ++i) {
            const object = this.objects[i];
            if (object.id === id) {
                return object;
            }
        }
        return false;
    }
    hasObject(object)
    {
        const index = this.objects.indexOf(object);
        return index !== -1 && this.objectsDead[index] === false;
    }
    removeObject(object)
    {
        if (object instanceof Engine.Object === false) {
            throw new TypeError('Invalid object');
        }
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objectsDead[index] = true;
        }
    }
    _cleanObjects()
    {
        const dead = this.objectsDead;
        const objects = this.objects;
        for (let i = 0, l = objects.length; i !== l;) {
            if (dead[i] === true) {
                this._cleanObject(objects[i]);
                objects.splice(i, 1);
                dead.splice(i, 1);
                --l;
            } else {
                ++i;
            }
        }
    }
    _cleanObject(object)
    {
        object.unsetWorld();
        this.collision.removeObject(object);
        if (object.model) {
            this.scene.remove(object.model);
        }
    }
    updateAnimation(deltaTime)
    {
        const adjustedDelta = deltaTime * this.timeStretch;
        this.objects.forEach(object => {
            object.updateAnimators(adjustedDelta);
        });
    }
    updateTime(deltaTime)
    {
        const adjustedDelta = deltaTime * this.timeStretch;
        this.timeTotal += adjustedDelta;

        this.objects.forEach(object => {
            object.timeShift(adjustedDelta, this.timeTotal);
        });

        this.collision.detect();

        this._cleanObjects();

        this.events.trigger(this.EVENT_UPDATE, [adjustedDelta, this.timeTotal]);
    }
}