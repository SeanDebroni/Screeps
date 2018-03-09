'use strict';
const CONST = require('CONSTANTS');

var cachedGetDistance = require('cachedGetDistance');
var cacheFind = require("cacheFind");

var makeCreep = require('makeCreep');
var util = require('util');

module.exports = {

  recycleCreeps: function (spawner)
  {
    var toRecycle = _.filter(Game.creeps, (creep) => ((creep.memory.task === CONST.TASK_WAITINGTOBERECYCLED) && creep.room.name == spawner.room.name));
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

  spawnRepairman: function (blueprint, spawner, workRoom, forceMake)
  {
    let repairBlueprint = blueprint.ROLE_REPAIRMAN;
    let maxRepairmen = repairBlueprint.maxCreeps;
    let maxLevel = repairBlueprint.maxLevel;

    if (forceMake)
    {
      maxRepairmen = 10;
      maxLevel = 50;
    }

    if (maxRepairmen == 0) return true;

    var repairmen = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.workRoom] == workRoom && (creep.memory.role === CONST.ROLE_REPAIRMAN)));

    if (repairmen.length < maxRepairmen)
    {
      //0.9 is magic number, felt right.
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
  spawnZergling: function (spawner, workRoom, maxZerglings, goAllOut)
  {
    if (maxZerglings == 0) return true;
    if (spawner == undefined) return true;

    var lings;
    if (goAllOut)
    {
      lings = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.workRoom] == workRoom) && (creep.memory.role === CONST.ROLE_ZERGLING) && creep.memory.task != CONST.TASK_SPAWNING);
    }
    else
    {
      lings = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.workRoom] == workRoom) && (creep.memory.role === CONST.ROLE_ZERGLING));
    }

    if (lings.length < maxZerglings)
    {
      let retiredLing = cacheFind.findCached(CONST.CACHEFIND_RETIREDZERGLINGS, spawner.room);
      if (retiredLing.length > 0)
      {
        let ling = retiredLing[0];
        ling.memory.task = ling.memory.role;
        ling.memory.workRoom = workRoom.name;
        ling.memory.targetID = -1;
        return false;
      }

      var totalLings = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.homeRoom] == spawner.room.name) && (creep.memory.role === CONST.ROLE_ZERGLING));
      //5 felt right, should maybe be refactored to be dynamic at some point, maybe in to blueprint
      if (totalLings.length < 5)
      {
        var res = makeCreep.makeZergling(spawner.room, workRoom, spawner, true, goAllOut);
        if (res != -1)
        {
          return false;
        }
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

    var reservers = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.workRoom] == workRoom && (creep.memory.role === CONST.ROLE_RESERVER)));

    if (reservers.length < maxReservers)
    {
      var mem = {};
      mem.role = CONST.ROLE_RESERVER;
      var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, reserverBlueprint.blueprint, mem, reserverBlueprint.maxLevel, true);
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

  spawnUpgrader: function (blueprint, spawner, workRoom, criticalOnly)
  {
    let upgraderBlueprint = blueprint.ROLE_UPGRADER;
    let makeExtra = upgraderBlueprint.addExtraIfHaveEnergy;
    let maxUpgraders = upgraderBlueprint.maxCreeps;

    let mem = {};
    mem.role = CONST.ROLE_UPGRADER;

    if (spawner.room != workRoom) maxUpgraders = 0;

    if (maxUpgraders == 0) return true;

    var level;
    var upgraders = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.workRoom] == workRoom && (creep.memory.role === CONST.ROLE_UPGRADER)));

    if (criticalOnly)
    {
      if (upgraders.length != 0) return true;
    }

    if (upgraders.length < maxUpgraders)
    {
      var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint, mem, upgraderBlueprint.maxLevel, true);
      if (res != -1)
      {
        return false;
      }
    }
    else
    {
      level = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint,
      {}, upgraderBlueprint.maxLevel, false);

      for (var i = 0; i < upgraders.length; ++i)
      {
        //6 just felt right for when to trigger an upgrade.
        if (level > upgraders[i].memory.lvl + 6)
        {
          console.log("Upgrading Upgrader: Old Level: " + upgraders[i].memory.lvl + " New Level: " + level);
          makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint, mem, upgraderBlueprint.maxLevel, true);
          upgraders[i].memory.task = CONST.TASK_RECYCLE;
          upgraders[i].memory.role = CONST.TASK_RECYCLE;
          return false;
        }
      }
    }

    if (makeExtra)
    {
      var sum = cacheFind.findCached(CONST.CACHEFIND_GETSTOREDENERGY, spawner.room);

      let makeLevel = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint,
      {}, upgraderBlueprint.maxLevel, false);

      if (makeLevel == -1) return true;
      let sumLevels = 0;
      for (let i = 0; i < upgraders.length; ++i)
      {
        sumLevels = sumLevels + upgraders[i].memory.lvl;
      }
      sumLevels = sumLevels + makeLevel;

      //1000 is rouge estimate, 100000 is so if terminal is not near controller there will still be energy near controller, 4 is when storage is makeable.
      if (((sumLevels * 1000) < sum && spawner.room.controller.level <= 3) || ((sumLevels * 1000) + (TERMINAL_CAPACITY + 100000) < sum && spawner.room.controller.level >= 4))
      {
        makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, upgraderBlueprint.blueprint, mem, upgraderBlueprint.maxLevel, true);
        return false;
      }
    }
    return true;
  },

  spawnBuilder: function (blueprint, spawner, workRoom, criticalOnly)
  {
    let builderBlueprint = blueprint.ROLE_BUILDER;
    let maxBuilders = builderBlueprint.maxCreeps;

    if (maxBuilders == 0) return true;

    let mem = {};
    mem.role = CONST.ROLE_BUILDER;

    if (cacheFind.findCached(CONST.CACHEFIND_CONSTRUCTIONSITES, workRoom)
      .length == 0)
    {
      return true;
    }

    var builders = _.filter(Game.creeps, (creep) => (Game.rooms[creep.memory.workRoom] == workRoom && (creep.memory.role === CONST.ROLE_BUILDER)));

    if (criticalOnly)
    {
      if (builders.length != 0) return true;
    }

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
        //4 is magic number for level threshold for upgrading builders.
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

    //magic numbers, roughly the time a round trip to/from source would take for the creep.
    let ticksToLive = 50;
    if (workRoom.name != spawner.room.name)
    {
      ticksToLive = 120;
    }
    var unfilteredHaulers = cacheFind.findCached(CONST.CACHEFIND_FINDHAULERS, workRoom);
    var haulers = _.filter(unfilteredHaulers, (creep) => (creep.ticksToLive > ticksToLive || creep.ticksToLive == undefined));



    //count to total capacity of the haulers for the room, and
    //  how many haulers are assigned to each source
    var sumCapac = 0;
    var droppedSum = 0;
    var sourcesCount = new Map();

    for (var i = 0; i < haulers.length; ++i)
    {
      sumCapac = sumCapac + haulers[i].carryCapacity;

      var assignedSource = haulers[i].memory.assignedSourceID;
      if (assignedSource != undefined)
      {
        if (sourcesCount.get(assignedSource) != undefined)
        {
          sourcesCount.set(assignedSource, sourcesCount.get(assignedSource) + 1);
        }
        else
        {
          sourcesCount.set(assignedSource, 1);
        }
      }
    }

    var droppedEnergy = cacheFind.findCached(CONST.CACHEFIND_DROPPEDENERGY, workRoom);

    for (var i = 0; i < droppedEnergy.length; ++i)
    {
      droppedSum = droppedSum + droppedEnergy[i].amount;
    }

    if (spawner.room.name != workRoom.name)
    {
      let containerSum = cacheFind.findCached(CONST.CACHEFIND_GETSTOREDENERGY, workRoom);
      droppedSum = droppedSum + (containerSum * 0.7);
    }

    //if we have too much shit on the ground, make a new hauler
    if (droppedSum > sumCapac)
    {
      var sources = cacheFind.findCached(CONST.CACHEFIND_SOURCES, workRoom);

      //Find the source that has the least amount of haulers assigned to it.
      var sourceLeastID = undefined;
      var sourceLeastCount = 99;
      for (var i = 0; i < sources.length; ++i)
      {
        var count = sourcesCount.get(sources[i].id);
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

      // if there is twice as much stuff dropped as there is capacity to carry it : or, it will take more then 2 trips to haul it all.
      //  make a new hauler
      if (sourceLeastCount < maxHaulersPerSource || (droppedSum > sumCapac * 2 && spawner.room.name != workRoom.name))
      {
        mem.assignedSourceID = sourceLeastID;
        var res = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, haulerBlueprint.blueprint, mem, haulerBlueprint.maxLevel, true);
        if (res != -1)
        {
          return false;
        }
      }
      //upgrade a hauler
      else
      {
        var level = makeCreep.makeBestCreepFromBlueprint(spawner, workRoom, haulerBlueprint.blueprint,
        {}, haulerBlueprint.maxLevel, false);
        for (var i = 0; i < haulers.length; ++i)
        {
          // 4 is magic number for when to trigger hauler upgrade
          if (level > haulers[i].memory.lvl + 4 || (level > (haulers[i].memory.lvl + 1) && spawner.room.controller.level < 4))
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
      //takes 3 ticks to move one space on road for current harvesters
      //18 was how long it took to spawn a harvester at the time.
      //50 is buffer time, magic number
      var ttspd = (cachedGetDistance.cachedGetDistance(spawner.pos, sources[i].pos) * 3) + 50 + 18;

      var unfilteredHarvesters = cacheFind.findCached(CONST.CACHEFIND_FINDHARVESTERS, workRoom);
      var harvesters2 = _.filter(unfilteredHarvesters, (creep) => (creep.memory.sID == sources[i].id && (creep.ticksToLive > ttspd || creep.ticksToLive == undefined)));

      if (harvesters2.length < harvBlueprint.maxCreepPerSource)
      {
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
          //2 levels higher OR level 1 and higher OR almost max level. Magic numbers!
          //This conditional is to work with fringe cases. kinda messy, probably better way.
          if ((level > harvesters2[k].memory.lvl + 1) || (level > harvesters2[k].memory.lvl && harvesters2[k].memory.level == 1) || (level == harvBlueprint.maxLevel - 2 && level > harvesters2[k].memory.lvl))
          {
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

  },

  spawnBaseHealer: function (blueprint, spawner)
  {
    var baseHealBlueprint = blueprint.ROLE_BASEHEALER;
    if (spawner == undefined || spawner == null) return true;

    let homeRoom = spawner.room;

    let mem = {};
    mem.role = CONST.ROLE_BASEHEALER;

    let maxBaseHealers = baseHealBlueprint.maxCreeps;
    let maxLevel = baseHealBlueprint.maxLevel;

    if (maxBaseHealers == 0) return true;

    var baseHealers = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_BASEHEALER && util.getHomeRoom(creep) == homeRoom)));
    if (baseHealers.length >= maxBaseHealers) return true;

    let damagedCreeps = cacheFind.findCached(CONST.CACHEFIND_FINDDAMAGEDCREEPS, spawner.room);
    if (damagedCreeps.length == 0) return true;

    var res = makeCreep.makeBestCreepFromBlueprint(spawner, homeRoom, baseHealBlueprint.blueprint, mem, maxLevel, true);
    if (res != -1)
    {
      return false;
    }

    return true;
  }
};