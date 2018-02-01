var util = require('util');
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

var taskFillBaseUtil =
{
  fillTowersAndStructures: function(creep, room)
  {
    var towersToFill = cacheFind.findCached(CONST.CACHEFIND_TOWERSTOFILL, room);
    if( towersToFill.length > 0)
    {
      var rand = Math.floor(Math.random() * towersToFill.length);
      creep.memory.targetID = towersToFill[rand].id;
      util.moveEnergyTo(creep, towersToFill[rand], true);
      return true;
    }
    else
    {
      //var baseToFill = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESTOFILL, util.getWorkRoom(creep));
      var baseToFill = (creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: (structure) =>
        {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity);
        }
      }));
      if(baseToFill)
      {
        creep.memory.targetID = baseToFill.id;
        util.moveEnergyTo(creep, baseToFill, true);
        return true;
      }
      else
      {
        var containersToFill = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSTOFILL, room);
        if(containersToFill.length>0)
        {
            var rand = Math.floor(Math.random() * containersToFill.length);
            creep.memory.targetID = containersToFill[rand].id;
            util.moveEnergyTo(creep, containersToFill[rand], true);
            return true;
        }

      }
    }
    return false;
  }
}

var taskFillBase =
{
  run: function(creep)
  {
    if(creep.carry.energy == 0)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
    }
    else
    {
      if(creep.memory.targetID != -1)
      {
        var target = Game.getObjectById(creep.memory.targetID);
        var err = util.moveEnergyTo(creep, target, true);

      }
      else
      {
        var haveTarget = false;
        if(!haveTarget) haveTarget = taskFillBaseUtil.fillTowersAndStructures(creep, util.getWorkRoom(creep));
        if(!haveTarget) haveTarget = taskFillBaseUtil.fillTowersAndStructures(creep, util.getHomeRoom(creep));
        if(!haveTarget)
        {
          var target = Game.flags["idlespot"];
          if(target)
          {
            var err = creep.moveTo(target, {rememberPath: 50});
          }
        }

      }
    }
  }
}

module.exports = taskFillBase;
