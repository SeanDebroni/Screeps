'use strict';
const CONST = require('CONSTANTS');
var util = require('util');
var cacheFind = require('cacheFind');

//Requires targetIDSet
var taskFlee = {

  run: function(creep)
  {
    if (creep.memory.role == CONST.ROLE_HARVESTER)
    {
      if (creep.carry.energy > 0)
      {
        creep.drop(RESOURCE_ENERGY);
      }
    }
    var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, util.getWorkRoom(creep));

    if (hostileCreeps.length > 0 || Game.rooms[creep.memory.workRoom] == undefined)
    {
      var flag = Game.flags[creep.memory.homeRoom + "idle"];
      if (flag != undefined && flag != null)
      {
        util.moveToWalkable(creep, flag, 50);
        return;
      }
    }
    else
    {
      creep.memory.task = creep.memory.role;
      return;
    }

  }

}

module.exports = taskFlee;
