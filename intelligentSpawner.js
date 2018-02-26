const CONST = require('CONSTANTS');
var cacheFind = require("cacheFind");
var _ = require('lodash');

var makeCreep = require('makeCreep');
var util = require('util');

var cachedGetDistance = require('cachedGetDistance');


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
  spawnRepairman: function (blueprint, spawner, workRoom)
  {
    let repairBlueprint = blueprint.ROLE_REPAIRMAN;
    let maxRepairmen = repairBlueprint.maxCreeps;
    let maxLevel = repairBlueprint.maxLevel;

    if (maxRepairmen == 0) return true;

    var repairmen = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_REPAIRMAN) && util.getWorkRoom(creep) == workRoom));

    if (repairmen.length < maxRepairmen)
    {
      var damagedStructures = _.filter(cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, workRoom), (structure) => (structure.hits < structure.hitsMax * 0.9));
      if (damagedStructures.length == 0) return true;

      var mem = {};
      mem.role = CONST.ROLE_REPAIRMAN;
      var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, repairBlueprint.blueprint, mem, repairBlueprint.maxLevel, true);
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
  spawnReserver: function (blueprint, spawner, workRoom)
  {
    let reserverBlueprint = blueprint.ROLE_RESERVER;
    let maxReservers = reserverBlueprint.maxCreeps;
    if (maxReservers == 0) return true;

    if (workRoom.controller.level > 0) return true;

    if (workRoom.controller.reservation != undefined)
    {
      if (workRoom.controller.reservation.ticksToEnd > 4100) return true;
    }
    var reservers = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_RESERVER) && util.getWorkRoom(creep) == workRoom));
    if (reservers.length < maxReservers)
    {
      var mem = {};
      mem.role = CONST.ROLE_RESERVER;
      var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, reserverBlueprint.blueprint, mem, reserverBlueprint.maxLevel, true);
      //var res = makeCreep.makeBestReserver(spawner.room, workRoom, spawner, true);
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
  spawnUpgrader: function (blueprint, spawner, workRoom)
  {
    let upgraderBlueprint = blueprint.ROLE_UPGRADER;
    let makeExtra = upgraderBlueprint.addExtraIfHaveEnergy;
    let maxUpgraders = upgraderBlueprint.maxCreeps;

    let mem = {};
    mem.role = CONST.ROLE_UPGRADER;

    if (spawner.room != workRoom) maxUpgraders = 0;

    if (maxUpgraders == 0) return true;
    var level;
    var upgraders = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_UPGRADER) && util.getWorkRoom(creep) == workRoom));
    if (upgraders.length < maxUpgraders)
    {
      console.log("Making Upgrader since <3");
      var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint, mem, upgraderBlueprint.maxLevel, true);
      //  var res = makeCreep.makeBestUpgrader(spawner.room, workRoom, spawner, true);
      if (res != -1)
      {
        return false;
      }
    }
    else
    {
      level = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint,
      {}, upgraderBlueprint.maxLevel, false);
      //level = makeCreep.makeBestUpgrader(spawner.room, workRoom, spawner, false);
      for (var i = 0; i < upgraders.length; ++i)
      {
        if (level > upgraders[i].memory.lvl + 6)
        {
          console.log("Upgrading Upgrader: Old Level: " + upgraders[i].memory.lvl + " New Level: " + level);
          makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint, mem, upgraderBlueprint.maxLevel, true);
          //makeCreep.makeBestUpgrader(spawner.room, workRoom, spawner, true);
          upgraders[i].memory.task = CONST.TASK_RECYCLE;
          upgraders[i].memory.role = CONST.TASK_RECYCLE;
          return false;
        }
      }
    }

    if (makeExtra)
    {
      var filledStructures = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, spawner.room);
      var sum = _.sum(filledStructures, function (a)
      {
        return a.store[RESOURCE_ENERGY];
      });
      //TODO - calc the val, instead of hardcoding 16000
      let makeLevel = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint,
      {}, upgraderBlueprint.maxLevel, false);
      if (makeLevel == -1) return true;
      let sumLevels = 0;
      for (let i = 0; i < upgraders.length; ++i)
      {
        sumLevels = sumLevels + upgraders[i].memory.lvl;
      }
      sumLevels = sumLevels + makeLevel;

      if (((sumLevels * 1000) < sum && spawner.room.controller.level <= 4) || ((sumLevels * 1000) + TERMINAL_CAPACITY < sum && spawner.room.controller.level >= 5))
      {
        makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint, mem, upgraderBlueprint.maxLevel, true);
        return false;
      }
    }
    return true;
  },

  spawnBuilder: function (blueprint, spawner, workRoom)
  {
    let builderBlueprint = blueprint.ROLE_BUILDER;
    let maxBuilders = builderBlueprint.maxCreeps;

    if (maxBuilders == 0) return true;

    let mem = {};
    mem.role = CONST.ROLE_BUILDER;

    if (cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, workRoom)
      .length == 0) return true;

    var builders = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_BUILDER) && util.getWorkRoom(creep) == workRoom));

    if (builders.length < maxBuilders)
    {
      var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, builderBlueprint.blueprint, mem, builderBlueprint.maxLevel, true);
      if (res != -1)
      {
        return false;
      }
    }
    else if (builders.length > 0 && builderBlueprint.upgradeCreeps)
    {
      var level = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, builderBlueprint.blueprint,
      {}, builderBlueprint.maxLevel, false);
      for (var i = 0; i < builders.length; ++i)
      {
        if (level > builders[i].memory.lvl + 4)
        {
          makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, builderBlueprint.blueprint, mem, builderBlueprint.maxLevel, true);
          builders[i].memory.targetID = -1;
          builders[i].memory.task = CONST.TASK_RECYCLE;
          builders[i].memory.role = CONST.TASK_RECYCLE;
          return false;
        }
      }
    }
    return true;

  },
  spawnHauler: function (blueprint, spawner, workRoom)
  {

    let haulerBlueprint = blueprint.ROLE_HAULER;
    let maxHaulersPerSource = haulerBlueprint.maxCreepPerHarvester;
    if (maxHaulersPerSource == 0) return true;

    let mem = {};
    mem.role = CONST.ROLE_HAULER;

    let ticksToLive = 50;
    if (workRoom.name != spawner.room.name)
    {
      ticksToLive = 120;
    }
    var unfilteredHaulers = cacheFind.findCached(CONST.CACHEFIND_FINDHAULERS, workRoom);
    var haulers = _.filter(unfilteredHaulers, (creep) => (creep.ticksToLive > ticksToLive || creep.ticksToLive == undefined));

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
    //console.log(workRoom.name + " DROPPED ENERGY: " + droppedSum);

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
      //console.log(sourceLeastCount + " SLC0");
      //console.log(sourceLeastID + " ID")
      if (sourceLeastCount < maxHaulersPerSource || (droppedSum > sumCapac * 2 && spawner.room.name != workRoom.name))
      {
        console.log("NEW HAULER");
        mem.assignedSourceID = sourceLeastID;
        var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, haulerBlueprint.blueprint, mem, haulerBlueprint.maxLevel, true);
        if (res != -1)
        {
          return false;
        }
      }
      else
      {
        //console.log("UPDATED HAULER");
        var level = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, haulerBlueprint.blueprint,
        {}, haulerBlueprint.maxLevel, false);
        for (var i = 0; i < haulers.length; ++i)
        {
          if (level > haulers[i].memory.lvl + 4 || (level > haulers[i].memory.lvl && spawner.room.controller.level < 4))
          {
            mem.assignedSourceID = haulers[i].memory.assignedSourceID;
            var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, haulerBlueprint.blueprint, mem, haulerBlueprint.maxLevel, true);
            if (res != -1)
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
  spawnHarvester: function (blueprint, spawner, workRoom)
  {
    var harvBlueprint = blueprint.ROLE_HARVESTER;
    var sources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, workRoom);

    let mem = {};
    mem.role = CONST.ROLE_HARVESTER;

    for (var i = 0; i < sources.length; ++i)
    {
      //takes 3 ticks to move one space on road for current harvesters TODO make this dynamic, add spawn time maybe add buffer?
      var ttspd = (cachedGetDistance.cachedGetDistance(spawner.pos, sources[i].pos) * 3) + 50 + 18;

      var unfilteredHarvesters = cacheFind.findCached(CONST.CACHEFIND_FINDHARVESTERS, workRoom);
      var harvesters2 = _.filter(unfilteredHarvesters, (creep) => (creep.memory.sID == sources[i].id && (creep.ticksToLive > ttspd || creep.ticksToLive == undefined)));

      if (harvesters2.length < harvBlueprint.maxCreepPerSource)
      {
        console.log("adding harvester because source missing one");
        mem.sID = sources[i].id;
        var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, harvBlueprint.blueprint, mem, harvBlueprint.maxLevel, true);
        if (res != -1)
        {
          return false;
        }
      }
      else
      {
        var level = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, harvBlueprint.blueprint,
        {}, harvBlueprint.maxLevel, false);
        for (var k = 0; k < harvesters2.length; ++k)
        {
          if ((level > harvesters2[k].memory.lvl + 1) || (level > harvesters2[k].memory.lvl && harvesters2[k].memory.level == 1) || (level >= harvBlueprint.maxLevel - 1 && level > harvesters2[k].memory.lvl))
          {
            console.log("UPGRADING HARV");
            mem.sID = sources[i].id;
            makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, harvBlueprint.blueprint, mem, harvBlueprint.maxLevel, true);
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