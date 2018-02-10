var cacheMoveTo = require('cacheMoveTo');
var cacheFind = require('cacheFind');
const CONST = require('CONSTANTS');


module.exports = {
  isRoomFucked: function (room)
  {
    var sources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, room);
    var harvesters = _.filter(Game.creeps, (creepA) => (creepA.memory.role == CONST.ROLE_HARVESTER && room == util.getWorkRoom(creepA)));

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
    if (ret == undefined)
    {
      return creep.room;
    }
    return ret;
  },
  isCreepStuck: function (creep, direction)
  {
    var posToLook = new RoomPosition();
    var cPos = creep.pos;
    posToLook.x = cPos.x;
    posToLook.y = cPos.y;
    switch (direction)
    {
    case TOP:
      posToLook.y = cPos.y - 1;
      break;
    case TOP_RIGHT:
      posToLook.y = cPos.y - 1;
      posToLook.x = cPos.x + 1;
      break;
    case RIGHT:
      posToLook.x = cPos.x + 1;
      break;
    case BOTTOM_RIGHT:
      posToLook.y = cPos.y + 1;
      posToLook.x = cPos.x + 1;
      break;
    case BOTTOM:
      posToLook.y = cPos.y + 1;
      break;
    case BOTTOM_LEFT:
      posToLook.y = cPos.y + 1;
      posToLook.x = cPos.x - 1;
      break;
    case LEFT:
      posToLook.x = cPos.x - 1;
      break;
    case TOP_LEFT:
      posToLook.y = cPos.y - 1;
      posToLook.x = cPos.x - 1;
      break;
    }
    var whatsThere = creep.lookAt(posToLook);
    for (var i = 0; i < whatsThere.length; ++i)
    {
      if (whatsThere[i].type === 'creep')
      {
        return true;
      }
    }
    return false;
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
      creep.moveTo(target,
      {
        reusePath: 10
      });
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
      creep.moveTo(target,
      {
        reusePath: 10
      });
    }
    return err;
  },

  pickupEnergyFrom: function (creep, target)
  {
    var result = creep.pickup(target);
    if (result == ERR_NOT_IN_RANGE)
    {
      creep.moveTo(target,
      {
        reusePath: 10
      });
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
      creep.moveTo(target,
      {
        reusePath: 10
      });
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