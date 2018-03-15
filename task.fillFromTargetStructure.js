'use strict';
var util = require('util');
const CONST = require('CONSTANTS');

function wipeCreepMemory(creep)
{
  creep.memory.targetID = -1;
  creep.memory.fillResourceType = undefined;
  creep.memory.task = creep.memory.role;
}

//uses
//  creep.memory.targetID
//  creep.memory.fillResourceType
var taskFillFromTargetStructure = {

  run: function (creep)
  {
    //check if targetID is set correctly.
    var targetID = creep.memory.targetID;
    if (targetID == undefined || targetID == null || targetID == -1)
    {
      wipeCreepMemory(creep);
      return;
    }

    //check if target exists
    var target = Game.getObjectById(targetID);
    if (target == undefined || target == null)
    {
      if (creep.room.name != creep.memory.workRoom)
      {
        util.moveToRoom(creep, creep.memory.workRoom);
        return;
      }
      else
      {
        wipeCreepMemory(creep);
        return;
      }
    }


    var whatToFill = creep.memory.fillResourceType;
    if (whatToFill == undefined || whatToFill == null)
    {
      console.log("ERROR: type of resource to fill not set correctly.");
      wipeCreepMemory(creep);
      return;
    }

    if (target.store == null || target.store == undefined)
    {
      console.log("ERROR: trying to fill from unsupported structure type");
      console.log(target);
      console.log(target.structureType);
      console.log(creep.memory.fillResourceType);
      console.log(creep.name);
      wipeCreepMemory(creep);
      return;
    }

    var amount = target.store[whatToFill];
    if (amount == 0 || amount == undefined || (amount < 50 && whatToFill == RESOURCE_ENERGY))
    {
      wipeCreepMemory(creep);
      return;
    }
    var err = creep.withdraw(target, whatToFill);
    if (err == ERR_NOT_IN_RANGE)
    {
      util.moveToNonWalkable(creep, target, 17);
    }
    else if (err == OK || ERR_FULL || ERR_NOT_ENOUGH_RESOURCES)
    {
      wipeCreepMemory(creep);
      return;
    }
    else if (err == ERR_INVALID_ARGS || ERR_INVALID_TARGET)
    {
      console.log("ERROR: invalid withdraw arguments, not sure why this is called. target|whatToFill -> err: " + err);
      console.log(target);
      console.log(whatToFill);
    }

  }

}

module.exports = taskFillFromTargetStructure;