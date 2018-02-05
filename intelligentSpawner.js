const CONST = require('CONSTANTS');
var cacheFind = require("cacheFind");

var makeCreep = require('makeCreep');
var util = require('util');

module.exports = {
  recycleCreeps: function (spawner)
  {
    var toRecycle = _.filter(Game.creeps, (creep) => ((creep.memory.task === CONST.TASK_WAITINGTOBERECYCLED) && creep.room == spawner.room));
    for (var i = 0; i < toRecycle.length; ++i)
    {
      spawner.recycleCreep(toRecycle[i]);
    }
  },
  spawnDisassembleFlag: function (spawner, workRoom, maxDisassemblers, flagName)
  {
    if (maxDisassemblers == 0) return true;
    var disassemblers = _.filter(Game.creeps, (creep) => ((creep.memory.targetID === flagName)));

    if (disassemblers.length < maxDisassemblers)
    {
      var res = makeCreep.makeDisassembleFlag(spawner.room, workRoom, spawner, true, flagName);
      if (res != -1)
      {
        return false;
      }
    }
    return true;
  },
  spawnRepairman: function (spawner, workRoom, maxRepairmen, maxLevel)
  {
    if (maxRepairmen == 0) return true;

    var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, workRoom);
    if (damagedStructures.length == 0) return true;


    var repairmen = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_REPAIRMAN) && util.getWorkRoom(creep) == workRoom));

    if (repairmen.length < maxRepairmen)
    {
      var res = makeCreep.makeBestRepairman(spawner.room, workRoom, spawner, true, maxLevel);
      if (res != -1)
      {
        return false;
      }
    }
    return true;
  },
  spawnZergling: function (spawner, workRoom, maxZerglings)
  {
    if (maxZerglings == 0) return true;
    var lings = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_ZERGLING) && util.getWorkRoom(creep) == workRoom));

    if (lings.length < maxZerglings)
    {
      var res = makeCreep.makeZergling(spawner.room, workRoom, spawner, true);
      if (res != -1)
      {
        return false;
      }
    }
    return true;

  },
  spawnReserver: function (spawner, workRoom, maxReservers)
  {
    if (maxReservers == 0) return true;

    if (workRoom.controller.level > 0) return true;

    if (workRoom.controller.reservation != undefined)
    {
      if (workRoom.controller.reservation.ticksToEnd > 4500) return true;
    }

    var reservers = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_RESERVER) && util.getWorkRoom(creep) == workRoom));
    if (reservers.length < maxReservers)
    {
      var res = makeCreep.makeBestReserver(spawner.room, workRoom, spawner, true);
      if (res != -1)
      {
        return false;
      }
    }
    return true;

  },
  spawnScout: function (spawner, workRoom, maxScouts, flagTarget)
  {
    if (maxScouts == 0) return true;
    var scouts;
    if (flagTarget == undefined)
    {
      scouts = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_SCOUT)));
    }
    else
    {
      scouts = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_SCOUT) && creep.memory.targetID == flagTarget));
    }
    if (scouts.length < maxScouts)
    {
      var res = makeCreep.makeBestScout(spawner.room, workRoom, spawner, true, flagTarget);
      if (res != -1)
      {
        return false;
      }
    }
    return true;
  },
  spawnUpgrader: function (spawner, workRoom, maxUpgraders)
  {
    if (maxUpgraders == 0) return true;

    var upgraders = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_UPGRADER) && util.getWorkRoom(creep) == workRoom));
    if (upgraders.length < maxUpgraders)
    {
      console.log("Making Upgrader since <3");
      var res = makeCreep.makeBestUpgrader(spawner.room, workRoom, spawner, true);
      if (res != -1)
      {
        return false;
      }
    }
    else
    {
      var level = makeCreep.makeBestUpgrader(spawner.room, workRoom, spawner, false);
      for (var i = 0; i < upgraders.length; ++i)
      {
        if (level > upgraders[i].memory.lvl + 4)
        {
          console.log("Upgrading Upgrader: Old Level: " + upgraders[i].memory.lvl + " New Level: " + level);
          makeCreep.makeBestUpgrader(spawner.room, workRoom, spawner, true);
          upgraders[i].memory.task = CONST.TASK_RECYCLE;
          upgraders[i].memory.role = CONST.TASK_RECYCLE;
          return false;
        }
      }
    }
    return true;
  },

  spawnBuilder: function (spawner, workRoom, maxBuilders)
  {
    if (maxBuilders == 0) return true;

    if (cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, workRoom)
      .length == 0) return true;

    var builders = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_BUILDER) && util.getWorkRoom(creep) == workRoom));

    if (builders.length < maxBuilders)
    {
      var res = makeCreep.makeBestBuilder(spawner.room, workRoom, spawner, true);
      if (res != -1)
      {
        return false;
      }
    }
    else if (builders.length > 0)
    {
      var level = makeCreep.makeBestBuilder(spawner.room, workRoom, spawner, false);
      for (var i = 0; i < builders.length; ++i)
      {
        if (level > builders[i].memory.lvl + 4)
        {
          makeCreep.makeBestBuilder(spawner.room, workRoom, spawner, true);
          builders[i].memory.targetID = -1;
          builders[i].memory.task = CONST.TASK_RECYCLE;
          builders[i].memory.role = CONST.TASK_RECYCLE;
          return false;
        }
      }
    }
    return true;

  },
  spawnHauler: function (spawner, workRoom, maxHaulersPerSource)
  {
    if (maxHaulersPerSource == 0) return true;

    var haulers = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_HAULER) && util.getWorkRoom(creep) == workRoom && creep.ticksToLive > 50));
    var droppedEnergy = cacheFind.findCached(CONST.CACHEFIND_DROPPEDENERGY, workRoom);


    var sumCapac = 0;
    var droppedSum = 0;

    var sourcesCount = new Map();


    for (var i = 0; i < haulers.length; ++i)
    {
      sumCapac = sumCapac + haulers[i].carryCapacity;

      //count the number of haulers assigned to each source
      var assignedSource = haulers[i].memory.assignedSourceID;
      if (assignedSource != undefined)
      {
        if (sourcesCount.get(assignedSource) != undefined)
        {
          //console.log("setting "+ assignedSource+ " to "+ (sourcesCount.get(assignedSource)+1));
          sourcesCount.set(assignedSource, sourcesCount.get(assignedSource) + 1);
        }
        else
        {
          //console.log("setting "+ assignedSource+ " to "+ 1);
          sourcesCount.set(assignedSource, 1);
        }
      }

    }

    for (var i = 0; i < droppedEnergy.length; ++i)
    {
      droppedSum = droppedSum + droppedEnergy[i].amount;
    }
    console.log("DROPPED ENERGY: " + droppedSum);

    //if we have too much shit on the ground, make a new hauler
    if (droppedSum > sumCapac)
    {
      //console.log("we need a new or upgraded hauler");
      var sources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, workRoom);
      //Find the source that has the least amount of haulers assigned to it.
      var sourceLeastID = undefined;
      var sourceLeastCount = 99;
      for (var i = 0; i < sources.length; ++i)
      {

        var count = sourcesCount.get(sources[i].id);
        //console.log(sources[i].id);
        //console.log(count);
        if (count == undefined)
        {
          sourceLeastID = sources[i].id;
          sourceLeastCount = 0;
        }
        else if (count < sourceLeastCount)
        {
          sourceLeastID = sources[i].id;
          sourceLeastCount = count;
        }
      }
      console.log(sourceLeastCount + " SLC0");
      console.log(sourceLeastID + " ID")
      if (sourceLeastCount < maxHaulersPerSource)
      {
        //console.log("NEW HAULER");
        var res = makeCreep.makeBestHauler(spawner.room, workRoom, spawner, true, sourceLeastID);
        if (res != -1)
        {
          return false;
        }
      }
      else
      {
        //console.log("UPDATED HAULER");
        var level = makeCreep.makeBestHauler(spawner.room, workRoom, spawner, false, 0);
        for (var i = 0; i < haulers.length; ++i)
        {
          if (level > haulers[i].memory.lvl + 4)
          {
            if (makeCreep.makeBestHauler(spawner.room, workRoom, spawner, true, haulers[i].assignedSourceID) != -1)
            {
              haulers[i].memory.targetID = -1;
              haulers[i].memory.task = CONST.TASK_RECYCLE;
              haulers[i].memory.role = CONST.TASK_RECYCLE;
              return false;
            }
          }
        }
      }
    }

    return true;

  },
  spawnHarvester: function (spawner, workRoom)
  {
    var sources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, workRoom);
    for (var i = 0; i < sources.length; ++i)
    {
      var ttspd = 40;
      if (spawner.room != workRoom) ttspd = 100;
      var harvesters2 = _.filter(Game.creeps, (creep) => (creep.memory.role == CONST.ROLE_HARVESTER && util.getWorkRoom(creep) == workRoom && creep.memory.sID == sources[i].id && creep.ticksToLive > ttspd));
      if (harvesters2.length < 1)
      {
        console.log("adding harvester because source missing one");
        var res = makeCreep.makeBestHarvester(spawner.room, workRoom, spawner, sources[i].id, true);
        if (res != -1)
        {
          return false;
        }
      }
      else
      {
        var level = makeCreep.makeBestHarvester(spawner.room, workRoom, spawner, sources[i].id, false);
        console.log(level);
        for (var k = 0; k < harvesters2.length; ++k)
        {
          if ((level > harvesters2[k].memory.lvl + 1) || (level >= 4 && level > harvesters2[k].memory.lvl))
          {
            console.log("UPGRADING HARV");
            makeCreep.makeBestHarvester(spawner.room, workRoom, spawner, sources[i].id, true);
            harvesters2[k].memory.targetID = -1;
            harvesters2[k].memory.task = CONST.TASK_RECYCLE;
            harvesters2[k].memory.role = CONST.TASK_RECYCLE;
            return false;
          }
        }
      }
    }
    return true;

  }


};