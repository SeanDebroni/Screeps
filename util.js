var cacheMoveTo = require('cacheMoveTo');
var cacheFind = require('cacheFind');
const CONST = require('CONSTANTS');


module.exports = {
  moveToRoom(creep, roomName)
  {
    const pos = new RoomPosition(25, 25, roomName);
    return creep.moveTo(pos,
    {
      reusePath: 10
    });
  },
  isAdjacent: function (pos1, pos2)
  {
    if (Math.abs(pos1.x - pos2.x) <= 1 && Math.abs(pos1.y - pos2.y) <= 1)
    {
      return true;
    }
    return false;
  },
  getNotBusySpawns: function (room)
  {
    var spawns = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, room);
    var notBusySpawns = [];
    //How many of them are spawning currently?
    for (var i = 0; i < spawns.length; ++i)
    {
      if (spawns[i].spawning == null)
      {
        notBusySpawns.push(spawns[i]);
      }
    }
    return notBusySpawns;
  },
  getHomeRoom: function (creep)
  {
    var ret = Game.rooms[creep.memory.homeRoom];
    if (ret == undefined)
    {
      return creep.room;
    }
    return ret;
  },
  getWorkRoom: function (creep)
  {
    var ret = Game.rooms[creep.memory.workRoom];
    if (ret == undefined && creep.memory.role != CONST.ROLE_RESERVER)
    {
      return creep.room;
    }
    return ret;
  },
  cleanUpDeadCreeps: function ()
  {
    for (var name in Memory.creeps)
    {
      if (!Game.creeps[name])
      {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },

  moveEnergyTo: function (creep, target, revertIfEmpty)
  {
    //optional parameter
    if (typeof revertIfEmpty === 'undefined')
    {
      revertIfEmpty = false;
    }

    var err = creep.transfer(target, RESOURCE_ENERGY);
    if (err == ERR_NOT_IN_RANGE)
    {
      cacheMoveTo.cacheMoveTo(creep, target);
    }
    else if (err == ERR_INVALID_TARGET)
    {
      console.log("Trying to move energy to an invalid target " + target);
      creep.memory.targetID = -1;
    }
    else if (err == ERR_FULL)
    {
      creep.memory.targetID = -1;
    }
    else if (err == OK)
    {
      var creepEnergy = creep.carry[RESOURCE_ENERGY];
      var targetSpace = -1;
      switch (target.structureType)
      {
      case STRUCTURE_SPAWN:
      case STRUCTURE_EXTENSION:
      case STRUCTURE_TOWER:
        targetSpace = target.energyCapacity - target.energy;
        break;

      case STRUCTURE_STORAGE:
      case STRUCTURE_CONTAINER:
        targetSpace = target.storeCapacity - _.sum(target.store);
        break;
      }

      if (creepEnergy >= targetSpace)
      {
        creep.memory.targetID = -1;
      }
      //if creep will be empty after this transfer
      if ((creepEnergy <= targetSpace) && revertIfEmpty)
      {
        creep.memory.task = creep.memory.role;
        creep.memory.targetID = -1;
      }
    }
    return err;
  },
  moveResourceTo: function (creep, target, RESOURCETYPE)
  {
    var err = creep.transfer(target, RESOURCETYPE);
    if (err == ERR_NOT_IN_RANGE)
    {
      cacheMoveTo.cacheMoveTo(creep, target);
    }
    return err;
  },

  pickupEnergyFrom: function (creep, target)
  {
    var result = creep.pickup(target);
    if (result == ERR_NOT_IN_RANGE)
    {
      var res2 = cacheMoveTo.cacheMoveTo(creep, target);
      if (res2 = ERR_NO_PATH)
      {
        return res2;
      }
    }
    return result;
  },
  withdrawEnergyFrom: function (creep, target, revertIfEmpty)
  {
    //optional parameter
    if (typeof revertIfEmpty === 'undefined')
    {
      revertIfEmpty = false;
    }

    var targetEnergy = 0;
    var creepSpace = creep.carryCapacity - _.sum(creep.carry);

    if (target == null || target == undefined)
    {
      return -67;
    }

    switch (target.structureType)
    {
    case STRUCTURE_SPAWN:
    case STRUCTURE_EXTENSION:
    case STRUCTURE_TOWER:
      targetEnergy = target.energy;
      break;

    case STRUCTURE_STORAGE:
    case STRUCTURE_CONTAINER:
      targetEnergy = target.store[RESOURCE_ENERGY];
      break;
    }
    var result = creep.withdraw(target, RESOURCE_ENERGY, Math.min(targetEnergy, creepSpace));
    if (result == ERR_NOT_IN_RANGE)
    {
      cacheMoveTo.cacheMoveTo(creep, target);
    }
    else if (result == ERR_NOT_ENOUGH_RESOURCES || result == ERR_INVALID_TARGET || result == ERR_FULL || result == ERR_INVALID_ARGS)
    {
      console.log("withdraw err");
      console.log(result);
      creep.memory.targetID = -1;
    }
    else if (result == OK)
    {
      if (creepSpace >= targetEnergy)
      {
        creep.memory.targetID = -1;
      }
      //if creep will be full after this transfer
      if ((creepSpace <= targetEnergy) && revertIfEmpty)
      {
        creep.memory.task = creep.memory.role;
        creep.memory.targetID = -1;
      }
    }
    return result;

  }

};