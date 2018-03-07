'use strict';
var util = require('util');
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

var baseHealer = {

  run: function (creep)
  {
    let damagedCreeps = cacheFind.findCached(CONST.CACHEFIND_FINDDAMAGEDCREEPS, Game.rooms[creep.memory.homeRoom]);

    if (damagedCreeps.length > 0)
    {
      creep.memory.targetID = damagedCreeps[0].id;
      creep.memory.task = CONST.TASK_HEALTARGET;
      return;
    }

    creep.memory.role = CONST.TASK_RECYCLE;
    creep.memory.task = CONST.TASK_RECYCLE;
    creep.memory.targetID = -1;

  }
}
module.exports = baseHealer;