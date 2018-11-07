'use strict';
var util = require('util');

function pickupEnergyFrom(creep, target)
{
  util.repairUnderCreep(creep);

  var result = creep.pickup(target);
  if (result == ERR_NOT_IN_RANGE)
  {
    var res2;
    if (creep.carry[RESOURCE_ENERGY] == 0)
    {
      res2 = util.moveToOffRoadNonWalkable(creep, target);
    }
    else
    {
      res2 = util.moveToNonWalkable(creep, target);
    }
    if (res2 = ERR_NO_PATH)
    {
      return res2;
    }
  }
  return result;
}

var taskPickUpEnergy = {
  run: function(creep)
  {
    //IMPORTANT : Tied toa check in ROLE HAULER
    if (creep.carry.energy > creep.carryCapacity * 0.95)
    {
      creep.memory.task = creep.memory.role;
      return;
    }
    /*  if (creep.room.name != creep.memory.workRoom)
      {
        util.moveToRoom(creep, creep.memory.workRoom);
        return;
      }*/
    var target = Game.getObjectById(creep.memory.targetID);
    if ((target == undefined || target == null) && creep.room.name != creep.memory.workRoom)
    {
      creep.memory.task = creep.memory.role;
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }
    else if (target == undefined || target == null)
    {
      creep.memory.task = creep.memory.role;
      return;

    }
    var result = pickupEnergyFrom(creep, target);
    if (result == OK || result == ERR_FULL)
    {
      creep.memory.task = creep.memory.role;
    }
    else if (result == ERR_INVALID_TARGET)
    {
      if (creep.memory.workRoom == creep.room.name)
      {
        creep.memory.task = creep.memory.role;
      }
    }

  }
}
module.exports = taskPickUpEnergy;
