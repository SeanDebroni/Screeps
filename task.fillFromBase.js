//fill up energy from base
var util = require("util");
const CONST = require("CONSTANTS");
var cacheFind = require("cacheFind");

var taskFillFromBaseUtil =
{

}

var taskFillFromBase = {
  run: function(creep)
  {
    if(creep.carry.energy < creep.carryCapacity)
    {
      if(creep.memory.targetID != -1)
      {
        var target = Game.getObjectById(creep.memory.targetID);
        var err = util.withdrawEnergyFrom(creep, target, true);
        return;
      }
      else
      {
        var baseContainers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getWorkRoom(creep));
        if(baseContainers.length > 0)
        {
            var rand = Math.floor(Math.random() * baseContainers.length)
            creep.memory.targetID = baseContainers[0].id;
            var target = Game.getObjectById(creep.memory.targetID);
            util.withdrawEnergyFrom(creep, target, true);
            return;
        }
        baseContainers =  cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getHomeRoom(creep));
        if(baseContainers.length > 0)
        {
            var rand = Math.floor(Math.random() * baseContainers.length)
            creep.memory.targetID = baseContainers[0].id;
            var target = Game.getObjectById(creep.memory.targetID);
            util.withdrawEnergyFrom(creep, target, true);
            return;
        }
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
      creep.memory.task = creep.memory.role;
    }
  }
}
module.exports = taskFillFromBase;
