'use strict';
var util = require('util');
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

function moveEnergyTo(creep, target, revertIfEmpty)
{
  //optional parameter
  if (typeof revertIfEmpty === 'undefined')
  {
    revertIfEmpty = false;
  }

  var err = creep.transfer(target, RESOURCE_ENERGY);
  if (err == ERR_NOT_IN_RANGE)
  {
    util.moveToNonWalkable(creep, target, 5);
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
}

var taskFillBaseUtil = {
  fillTowersAndStructures: function (creep, room)
  {
    //var baseToFill = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESTOFILL, room);
    //This only works if creep is in same room. Hmmmmmm.HRM. TODO find path to room, then entrance would use, then from that entrance find closest to fill.
    if (creep.room.name != creep.memory.homeRoom)
    {
      util.moveToRoom(creep, creep.memory.homeRoom);
      return true;
    }

    var baseToFill = (creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
    {
      filter: (structure) =>
      {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity);
      }
    }));

    if (baseToFill == null)
    {
      baseToFill = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESTOFILL, room);
    }
    if (Array.isArray(baseToFill))
    {
      baseToFill = baseToFill[Math.floor(Math.random() * baseToFill.length)];
    }
    if (baseToFill)
    {
      creep.memory.targetID = baseToFill.id;
      moveEnergyTo(creep, baseToFill, true);
      return true;
    }

    var towersToFill = cacheFind.findCached(CONST.CACHEFIND_TOWERSTOFILL, room);
    var harvesters2 = cacheFind.findCached(CONST.CACHEFIND_FINDHARVESTERS, Game.rooms[creep.memory.homeRoom]);
    //var harvesters2 = _.filter(Game.creeps, (creepA) => (creepA.memory.role == CONST.ROLE_HARVESTER && util.getHomeRoom(creep) == util.getWorkRoom(creep)));
    if (harvesters2.length == 0) towersToFill = [];
    if (towersToFill.length > 0)
    {
      var rand = Math.floor(Math.random() * towersToFill.length);
      creep.memory.targetID = towersToFill[rand].id;
      moveEnergyTo(creep, towersToFill[rand], true);
      return true;
    }



    var containersToFill = cacheFind.findCached(CONST.CACHEFIND_ENERGYCONTAINERSTOFILL, room);
    if (containersToFill.length > 0)
    {
      var rand = Math.floor(Math.random() * containersToFill.length);
      creep.memory.targetID = containersToFill[rand].id;
      moveEnergyTo(creep, containersToFill[rand], true);
      return true;
    }





    return false;
  }
}

var taskFillBase = {
  run: function (creep)
  {
    if (creep.carry.energy == 0)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
      return;
    }
    else
    {
      if (creep.memory.targetID != -1)
      {
        var target = Game.getObjectById(creep.memory.targetID);
        var err = moveEnergyTo(creep, target, true);
        return;

      }
      else
      {
        var haveTarget = false;
        //if (!haveTarget) haveTarget = taskFillBaseUtil.fillTowersAndStructures(creep, util.getWorkRoom(creep));
        if (!haveTarget) haveTarget = taskFillBaseUtil.fillTowersAndStructures(creep, util.getHomeRoom(creep));
        if (!haveTarget)
        {
          var flag = Game.flags[creep.memory.homeRoom + "idle"];
          if (flag != undefined && flag != null)
          {
            util.moveToWalkable(creep, flag, 50);
          }

        }

      }
    }
  }
}

module.exports = taskFillBase;