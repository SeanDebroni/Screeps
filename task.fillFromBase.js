//fill up energy from base
var util = require("util");
const CONST = require("CONSTANTS");
var cacheFind = require("cacheFind");

var taskFillFromBaseUtil = {

}

var taskFillFromBase = {
  run: function (creep)
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
        var err = util.withdrawEnergyFrom(creep, target, true);
        return;
      }
      else
      {
        var baseContainers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getWorkRoom(creep));
        if (baseContainers.length > 0)
        {
          var containerToFillFrom = -1;
          for (var i = 0; i < baseContainers.length; ++i)
          {
            if (util.isAdjacent(creep.pos, baseContainers[i].pos))
            {
              containerToFillFrom = i;
              break;
            }
          }
          if (containerToFillFrom == -1)
          {
            containerToFillFrom = Math.floor(Math.random() * baseContainers.length);
          }
          creep.memory.targetID = baseContainers[containerToFillFrom].id;
          var target = Game.getObjectById(baseContainers[containerToFillFrom].id);
          util.withdrawEnergyFrom(creep, target, true);
          return;
        }
        baseContainers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getHomeRoom(creep));
        if (baseContainers.length > 0)
        {
          var containerToFillFrom = -1;
          for (var i = 0; i < baseContainers.length; ++i)
          {
            if (util.isAdjacent(creep.pos, baseContainers[i].pos))
            {
              containerToFillFrom = i;
              break;
            }
          }
          if (containerToFillFrom == -1)
          {
            containerToFillFrom = Math.floor(Math.random() * baseContainers.length);
          }
          creep.memory.targetID = baseContainers[containerToFillFrom].id;
          var target = Game.getObjectById(baseContainers[containerToFillFrom].id);
          util.withdrawEnergyFrom(creep, target, true);
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
            util.withdrawEnergyFrom(creep, target);
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