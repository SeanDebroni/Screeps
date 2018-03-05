var util = require('util');

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

    switch (target.structureType)
    {
    case STRUCTURE_CONTAINER:
      var whatToFill = creep.memory.fillResourceType;
      if (whatToFill == undefined || whatToFill == null)
      {
        console.log("ERROR: type of resource to fill not set correctly.");
        wipeCreepMemory(creep);
        return;
      }

      var amount = target.store[whatToFill];
      if (amount == 0 || amount == undefined)
      {
        wipeCreepMemory(creep);
        return;
      }
      var err = creep.withdraw(target, whatToFill);
      if (err == ERR_NOT_IN_RANGE)
      {
        creep.moveTo(target,
        {
          reusePath: 17
        });
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
      break;

      //Not handling other cases atm, only containers
    default:
      console.log("ERROR: trying to fill from unsupported structure type");
      wipeCreepMemory(creep);
      return;

    }

  }


}

module.exports = taskFillFromTargetStructure;