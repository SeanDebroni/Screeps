var util = require('util');
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');

var taskFillBaseUtil = {
  fillTowersAndStructures: function (creep, room)
  {
    //var baseToFill = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESTOFILL, room);
    //This only works if creep is in same room. Hmmmmmm.HRM. TODO find path to room, then entrance would use, then from that entrance find closest to fill.
    if (creep.room.name != creep.memory.homeRoom)
    {
      util.moveToRoom(creep, creep.memory.homeRoom);
      return true;
    }
    var baseToFill = (creep.pos.findClosestByRange(FIND_MY_STRUCTURES,
    {
      filter: (structure) =>
      {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity);
      }
    }));
    if (baseToFill == null)
    {
      baseToFill = cacheFind.findCached(CONST.CACHEFIND_STRUCTURESTOFILL, room);
    }
    if (Array.isArray(baseToFill))
    {
      baseToFill = baseToFill[Math.floor(Math.random() * baseToFill.length)];
    }
    if (baseToFill)
    {
      creep.memory.targetID = baseToFill.id;
      util.moveEnergyTo(creep, baseToFill, true);
      return true;
    }

    var towersToFill = cacheFind.findCached(CONST.CACHEFIND_TOWERSTOFILL, room);
    var harvesters2 = cacheFind.findCached(CONST.CACHEFIND_FINDHARVESTERS, Game.rooms[creep.memory.homeRoom]);
    //var harvesters2 = _.filter(Game.creeps, (creepA) => (creepA.memory.role == CONST.ROLE_HARVESTER && util.getHomeRoom(creep) == util.getWorkRoom(creep)));
    if (harvesters2.length == 0) towersToFill = [];
    if (towersToFill.length > 0)
    {
      var rand = Math.floor(Math.random() * towersToFill.length);
      creep.memory.targetID = towersToFill[rand].id;
      util.moveEnergyTo(creep, towersToFill[rand], true);
      return true;
    }



    var containersToFill = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSTOFILL, room);
    if (containersToFill.length > 0)
    {
      var rand = Math.floor(Math.random() * containersToFill.length);
      creep.memory.targetID = containersToFill[rand].id;
      util.moveEnergyTo(creep, containersToFill[rand], true);
      return true;
    }





    return false;
  }
}

var taskFillBase = {
  run: function (creep)
  {
    if (creep.carry.energy == 0)
    {
      creep.memory.task = creep.memory.role;
      creep.memory.targetID = -1;
      return;
    }
    else
    {
      if (creep.memory.targetID != -1)
      {
        var target = Game.getObjectById(creep.memory.targetID);
        var err = util.moveEnergyTo(creep, target, true);
        return;

      }
      else
      {
        var haveTarget = false;
        //if (!haveTarget) haveTarget = taskFillBaseUtil.fillTowersAndStructures(creep, util.getWorkRoom(creep));
        if (!haveTarget) haveTarget = taskFillBaseUtil.fillTowersAndStructures(creep, util.getHomeRoom(creep));
        if (!haveTarget)
        {
          var flag = Game.flags[creep.memory.homeRoom + "idle"];
          if (flag != undefined && flag != null)
          {
            creep.moveTo(flag,
            {
              reusePath: 10
            });
          }

        }

      }
    }
  }
}

module.exports = taskFillBase;