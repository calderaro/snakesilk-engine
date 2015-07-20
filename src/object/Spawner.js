Engine.assets.Spawner = function()
{
    Engine.assets.Object.call(this);

    this.maxSimultaneousSpawns = 1;
    this.spawnCount = undefined;
    this.spawnInterval = undefined;
    this.spawnSource = [];
    this.spawnedObjects = [];
    this.minDistance = undefined;
    this.maxDistance = 256;
    this.timeSinceLastSpawn = 0;
}

Engine.assets.Spawner.prototype = Object.create(Engine.assets.Object.prototype);
Engine.assets.Spawner.constructor = Engine.assets.Spawner;

Engine.assets.Spawner.prototype.cleanReferences = function()
{
    for (var i in this.spawnedObjects) {
        if (this.scene.objects.indexOf(this.spawnedObjects[i]) == -1) {
            this.spawnedObjects.splice(i, 1);
        }
    }
}

Engine.assets.Spawner.prototype.spawnObject = function()
{
    this.cleanReferences();
    if (this.spawnedObjects.length >= this.maxSimultaneousSpawns) {
        return false;
    }

    if (this.minDistance || this.maxDistance) {
        var dist = undefined;
        for (var o, i = 0, l = this.scene.objects.length; i < l; i++) {
            o = this.scene.objects[i];
            if (o.isPlayer) {
                dist = o.position.distanceTo(this.position);
                if (dist > this.maxDistance || dist < this.minDistance) {
                    return false;
                }
            }
        }
    }

    if (this.spawnCount < 1) {
        return false;
    }
    this.spawnCount--;

    var index = Math.floor(Math.random() * this.spawnSource.length);
    var object = new this.spawnSource[index]();
    object.position.copy(this.position);
    this.spawnedObjects.push(object);
    this.scene.addObject(object);
    return object;
}

Engine.assets.Spawner.prototype.timeShift = function(dt)
{
    this.timeSinceLastSpawn += dt;
    if (this.timeSinceLastSpawn >= this.spawnInterval) {
        if (this.spawnObject()) {
            this.timeSinceLastSpawn = 0;
        }
    }
}