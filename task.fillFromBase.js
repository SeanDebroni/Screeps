'use strict';
//fill up energy from base
var util = require("util");
const CONST = require("CONSTANTS");
var cacheFind = require("cacheFind");

function withdrawEnergyFrom(creep, target, revertIfEmpty)
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
    return -67; //??????????????
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
    case STRUCTURE_TERMINAL:
    case STRUCTURE_LAB:
      targetEnergy = target.store[RESOURCE_ENERGY];
      break;
    default:
      console.log(target.structureType + " IS NOT SUPPORTED FOR FILLING FROM");
      break;
  }

  if (targetEnergy < 50)
  {
    return ERR_NOT_ENOUGH_RESOURCES;
  }

  var result = creep.withdraw(target, RESOURCE_ENERGY, Math.min(targetEnergy, creepSpace));
  if (result == ERR_NOT_IN_RANGE)
  {
    util.moveToNonWalkable(creep, target);
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


var taskFillFromBase = {
  run: function(creep)
  {
    if (creep.carry.energy < creep.carryCapacity)
    {
      if (creep.memory.targetID != -1)
      {
        var target = Game.getObjectById(creep.memory.targetID);
        if (target == null)
        {
          creep.memory.targetID = -1;
          return;
        }
        let err = withdrawEnergyFrom(creep, target, true);
        if (err == ERR_NOT_ENOUGH_RESOURCES)
        {
          creep.memory.targetID = -1;
        }
        return;
      }
      else
      {
        var baseContainers;
        if (creep.memory.workRoom != creep.memory.homeRoom)
        {
          baseContainers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getWorkRoom(creep));
          if (baseContainers.length > 0)
          {
            containerToFillFrom = 0;

            creep.memory.targetID = baseContainers[containerToFillFrom].id;
            var target = Game.getObjectById(baseContainers[containerToFillFrom].id);
            let err = withdrawEnergyFrom(creep, target, true);
            if (err == ERR_NOT_ENOUGH_RESOURCES)
            {
              creep.memory.targetID = -1;
            }
            return;
          }
        }

        baseContainers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getHomeRoom(creep));
        if (baseContainers.length > 0)
        {
          var containerToFillFrom = -1;
          var minDistance = 99999;
          var minDistIndex = -1;
          if (creep.room.name == creep.memory.homeRoom)
          {
            for (var i = 0; i < baseContainers.length; ++i)
            {
              var dist = creep.pos.getRangeTo(baseContainers[i].pos);
              if (dist < minDistance)
              {
                minDistance = dist;
                minDistIndex = i;
              }
              if (minDistance == 1) break;
            }
          }
          containerToFillFrom = minDistIndex;
          if (containerToFillFrom == -1)
          {
            containerToFillFrom = Math.floor(Math.random() * baseContainers.length);
          }
          creep.memory.targetID = baseContainers[containerToFillFrom].id;
          var target = Game.getObjectById(baseContainers[containerToFillFrom].id);
          let err = withdrawEnergyFrom(creep, target, true);
          if (err == ERR_NOT_ENOUGH_RESOURCES)
          {
            creep.memory.targetID = -1;
          }
          return;
        }
        creep.memory.targetID = -1;
        creep.memory.task = creep.memory.role;
        /*else
        {
          var baseBuildings = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESWITHENERGY, util.getWorkRoom(creep));
          if(baseBuildings.length > 0)
          {
            var rand = Math.floor(Math.random() * baseBuildings.length)
            creep.memory.targetID = baseBuildings[0].id;
            var target = Game.getObjectById(creep.memory.targetID);
            withdrawEnergyFrom(creep, target);
          }
          else
          {
            creep.memory.task = creep.memory.role;
          }
        }*/
      }

    }
    else
    {
      creep.memory.targetID = -1;
      creep.memory.task = creep.memory.role;
    }
  }
}
module.exports = taskFillFromBase;
