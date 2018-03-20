'use strict';
const CONST = require('CONSTANTS');

var roleMineralMiner = {
  run: function (creep)
  {
    if (_.sum(creep.carry) == 0)
    {
      let timeThreshold = Math.floor(creep.carryCapacity / (creep.memory.lvl / 2)) * 5 + 60;
      console.log("!!!");
      console.log(timeThreshold);
      if (creep.ticksToLive < timeThreshold)
      {
        creep.memory.targetID = -1;
        creep.memory.role = CONST.TASK_RECYCLE;
        creep.memory.task = CONST.TASK_RECYCLE;
        return;
      }
      creep.memory.task = CONST.TASK_MINEMINERAL;
      return;
    }
    else
    {
      var room = Game.rooms[creep.memory.homeRoom];
      if (room == undefined || room == null)
      {
        creep.memory.task = CONST.TASK_RECYCLE;
        creep.memory.role = CONST.TASK_RECYCLE;
        creep.memory.targetID = -1;
        return;
      }
      var toFill = undefined;
      if (room.terminal)
      {
        if (_.sum(room.terminal.store) - room.terminal.store[RESOURCE_ENERGY] < 150000)
        {
          toFill = room.terminal;
        }
      }
      if (toFill == undefined)
      {
        toFill = room.storage;
      }
      if (toFill == undefined)
      {
        creep.memory.task = CONST.TASK_RECYCLE;
        creep.memory.role = CONST.TASK_RECYCLE;
        creep.memory.targetID = -1;
        return;
      }

      creep.memory.task = CONST.TASK_FILLTARGETSTRUCTURE;
      creep.memory.targetID = toFill.id;
      return;
    }

  }
};
module.exports = roleMineralMiner;