'use strict';
const CONST = require('CONSTANTS');

var roleScout = {
  run: function (creep)
  {
    //if you have a target, move to it.
    if (creep.memory.targetID != undefined)
    {
      creep.memory.task = CONST.TASK_MOVETOTARGET;
      return;
    }

    //if there is a scout flag, move to it.
    var flags = Game.flags;
    if (flags["scout"] != undefined)
    {
      creep.memory.targetID = flags["scout"].name;
      creep.memory.task = CONST.TASK_MOVETOTARGET;
      return;
    }

  }
};
module.exports = roleScout;