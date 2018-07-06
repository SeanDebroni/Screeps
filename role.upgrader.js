'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var roleUpgrader = {

  run: function(creep)
  {
    //if not full, fill.
    if (creep.carry.energy < creep.carryCapacity)
    {
      //If there is no energy to be used in room, and no energy on the builder, go idle.
      if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.homeRoom])
        .length == 0 && creep.carry.energy == 0)
      {
        var flag = Game.flags[creep.memory.homeRoom + "idle"];
        if (flag != undefined && flag != null)
        {
          util.moveToWalkable(creep, flag, 50);
          return;
        }
      }

      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
      return;
    }
    //we are full of energy, upgrade
    else
    {
      creep.memory.task = CONST.TASK_UPGRADEROOM;
      return;
    }
  }
};

module.exports = roleUpgrader;
