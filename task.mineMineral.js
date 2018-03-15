'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

function wipeCreepMemory(creep)
{
  creep.memory.targetID = -1;
  creep.memory.task = creep.memory.role;
}

var taskMineMineral = {
  run: function (creep)
  {
    var extractor = Game.getObjectById(creep.memory.extractorID);
    if (extractor == undefined || extractor == null)
    {
      wipeCreepMemory(creep);
      creep.memory.task = CONST.TASK_RECYCLE;
      creep.memory.role = CONST.TASK_RECYCLE;
      return;
    }
    if (extractor.cooldown != 0) return;

    var target = Game.getObjectById(creep.memory.targetID);
    if (target == undefined || target == null)
    {
      var minerals = cacheFind.findCached(CONST.CACHEFIND_FINDMINERALS, util.getWorkRoom(creep));
      if (minerals.length == 0)
      {
        wipeCreepMemory(creep);
        return;
      }
      else
      {
        creep.memory.targetID = minerals[0].id;
        target = minerals[0];
      }
    }

    var err = creep.harvest(target);
    if (err == ERR_NOT_IN_RANGE)
    {
      util.moveToNonWalkable(creep, target, 17);
      return;
    }
    else if (err == ERR_NOT_ENOUGH_RESOURCES)
    {
      creep.memory.task = creep.memory.role;
      return;
    }
    var workCount = creep.memory.workPartCount;
    if (workCount == undefined)
    {
      workCount = util.countWorkParts(creep);
      creep.memory.workPartCount = workCount;
    }

    var space = creep.carryCapacity - (_.sum(creep.carry));
    if (space - (2 * workCount) < 0)
    {
      creep.memory.task = creep.memory.role;
      return;
    }

  }
};
module.exports = taskMineMineral;