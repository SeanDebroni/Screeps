var utilMovement = require('util.movement');

var cacheMoveToM = new Map();

module.exports = {

  cacheMoveTo: function (creep, to)
  {
    var err11 = creep.moveTo(to,
    {
      reusePath: 10
    });
    return err11;
    var key = creep.room.name + creep.pos.x + " " + creep.pos.y + " " + to.room.name + to.pos.x + " " + to.pos.y;

    if (cacheMoveToM.has(key))
    {
      //if(Game.time%2==0)
      var path = Room.deserializePath(cacheMoveToM.get(key));

      if (path[0] != undefined)
      {
        if (utilMovement.isCreepStuck(creep, path[0].direction))
        {
          cacheMoveToM.delete(key);
          var shouldIgnoreCreeps = true;
          if (Math.random() < 0.5)
          {
            shouldIgnoreCreeps = false;
          }
          var path = creep.room.findPath(creep.pos, to.pos,
          {
            ignoreCreeps: shouldIgnoreCreeps
          });
          cacheMoveToM.set(key, Room.serializePath(path));
          return creep.moveByPath(path);
        }
      }
      var err = creep.moveByPath(Room.deserializePath(cacheMoveToM.get(key)));
      if (err == ERR_NOT_FOUND || err == ERR_INVALID_ARGS)
      {
        cacheMoveToM.delete(key);
      }
      return err;
    }
    else
    {
      var path = creep.room.findPath(creep.pos, to.pos,
      {
        ignoreCreeps: true
      });
      cacheMoveToM.set(key, Room.serializePath(path));
      return creep.moveByPath(path);
    }
  },

  cacheMoveToClear: function ()
  {
    cacheMoveToM = new Map();
    Memory.cacheMoveToMSize = 0;
    Memory.cacheMoveToM = undefined;

  },
  cacheMoveToSave: function ()
  {
    if (cacheMoveToM.size > 0)
    {
      Memory.cacheMoveToMSize = cacheMoveToM.size;
      Memory.cacheMoveToM = JSON.stringify([...cacheMoveToM]);
    }


  },
  cacheMoveToLoad: function ()
  {

    if (Memory.cacheMoveToM != undefined)
    {
      var temp = JSON.parse(Memory.cacheMoveToM);
      var tempArr = temp.toString()
        .split(',');
      var arrSize = Memory.cacheMoveToMSize;
      cacheMoveToM = new Map();
      for (var i = 0; i < arrSize * 2; i = i + 2)
      {
        cacheMoveToM.set(tempArr[i], tempArr[i + 1]);
      }

    }



  }



}