'use strict';
var intelligentSpawner = require("intelligentSpawner");
var util = require("util");
var cacheFind = require("cacheFind");
const CONST = require('CONSTANTS');
const BLUEPRINTS = require("BLUEPRINTS");
var roadBuilder = require('roadBuilder');
var terminalLogic = require('terminalLogic');

let roomControllers = [];
let savedFlagLength = 0;

let didNothingLastTick = {};




function getMainBlueprint(mainRoom)
{

  switch (mainRoom.controller.level)
  {
    case 1:
      return BLUEPRINTS.RCL_ONE_MAIN_CREEP;
    case 2:
      return BLUEPRINTS.RCL_TWO_MAIN_CREEP;
    case 3:
      return BLUEPRINTS.RCL_THREE_MAIN_CREEP;
    case 4:
      return BLUEPRINTS.RCL_FOUR_MAIN_CREEP;
    case 5:
      return BLUEPRINTS.RCL_FIVE_MAIN_CREEP;
    case 6:
      return BLUEPRINTS.RCL_SIX_MAIN_CREEP;
    case 7:
      return BLUEPRINTS.RCL_SEVEN_MAIN_CREEP;
    case 8:
      return BLUEPRINTS.RCL_EIGHT_MAIN_CREEP;

  }
  console.log("invalid controller level in blueprint");
  return undefined;
}

function getExtBlueprint(mainRoom)
{
  switch (mainRoom.controller.level)
  {
    case 1:
      return BLUEPRINTS.RCL_ONE_EXT_CREEP;
    case 2:
      return BLUEPRINTS.RCL_TWO_EXT_CREEP;
    case 3:
      return BLUEPRINTS.RCL_THREE_EXT_CREEP;
    case 4:
      return BLUEPRINTS.RCL_FOUR_EXT_CREEP;
    case 5:
      return BLUEPRINTS.RCL_FIVE_EXT_CREEP;
    case 6:
      return BLUEPRINTS.RCL_SIX_EXT_CREEP;
    case 7:
      return BLUEPRINTS.RCL_SEVEN_EXT_CREEP;
    case 8:
      return BLUEPRINTS.RCL_EIGHT_EXT_CREEP;
  }
  console.log("invalid controller level in blueprint");
  return undefined;
}
//Done
function recycleCreeps(mainRoom)
{
  var spawnsToRec = cacheFind.findCached(CONST.CACHEFIND_SPAWNS, mainRoom);
  for (var i = 0; i < spawnsToRec.length; ++i)
  {
    intelligentSpawner.recycleCreeps(spawnsToRec[i]);
  }
}

//Done
function makeScoutForFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn)
{
  let didntMakeCreep = intelligentSpawner.spawnScout(notBusySpawns[0], mainBaseRoom, 1, flagName);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;

  return curSpawn;

}

//Done
function runDisassemblyFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn)
{
  let didntMakeCreep;

  if (curSpawn > 0) return curSpawn;
  didntMakeCreep = intelligentSpawner.spawnDisassembleFlag(notBusySpawns[curSpawn], Game.flags[flagName].room, 1, flagName);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;

  return curSpawn;
}


function runColonyRoomPriorityOne(colonyRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = BLUEPRINTS.RCL_ALL_COL_CREEP;
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, colonyRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, colonyRoom);
  let didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      //didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], colonyRoom, 1);
      //if (!didntMakeCreep) curSpawn = curSpawn + 1;
      //if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }
  return curSpawn;
}

function runColonyRoomPriorityTwo(colonyRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = BLUEPRINTS.RCL_ALL_COL_CREEP;

  let didntMakeCreep = intelligentSpawner.spawnClaimer(blueprint, notBusySpawns[curSpawn], colonyRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnColonist(blueprint, notBusySpawns[curSpawn], colonyRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

//done
function runMainRoomPriorityZero(mainRoom, notBusySpawns, curSpawn)
{
  let didntMakeCreep;

  let blueprint2 = BLUEPRINTS.RCL_ALL_PL_CREEP;

  let terminal = mainRoom.terminal;
  if (terminal && (terminal.store[RESOURCE_ENERGY] > 45000 || (mainRoom.storage && mainRoom.storage[RESOURCE_ENERGY] > 150000)) && (cacheFind.findCached(CONST.CACHEFIND_ENERGYCONTAINERSTOFILL, mainRoom).length > 1))
  {
    didntMakeCreep = intelligentSpawner.spawnEnergyTransferer(blueprint2, notBusySpawns[curSpawn], mainRoom, 1, terminal);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, mainRoom);

  if (hostileCreeps.length > 0)
  {
    for (var i = 0; i < hostileCreeps.length; ++i)
    {
      if (util.isDangerousCreep(hostileCreeps[i]))
      {
        let makeSuper = false;
        if (hostileCreeps[0].owner.username == "Alcardian") makeSuper = true;
        didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], mainRoom, 8, true, makeSuper);
        if (!didntMakeCreep) curSpawn = curSpawn + 1;
        if (curSpawn >= notBusySpawns.length) return curSpawn;
      }
    }
  }


  return curSpawn;
  //END ATTACK CODE

}

function runMainRoomPriorityOne(mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getMainBlueprint(mainRoom);

  if (curSpawn >= notBusySpawns.length) return curSpawn;

  //ATTACK CODE
  let didntMakeCreep;


  let blueprint2 = BLUEPRINTS.RCL_ALL_PL_CREEP;

  let terminal = mainRoom.terminal;

  if (cacheFind.findCached(CONST.CACHEFIND_CRITICALDAMAGEDSTRUCTURES, mainRoom).length > 1)
  {
    if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
    {
      console.log(mainRoom.name);
      didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], mainRoom, false, 3);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }

  didntMakeCreep = intelligentSpawner.spawnHauler(blueprint, notBusySpawns[curSpawn], mainRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnHarvester(blueprint, notBusySpawns[curSpawn], mainRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;
  /*
    didntMakeCreep = intelligentSpawner.spawnBaseHealer(blueprint, notBusySpawns[curSpawn]);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;*/

  //only one
  if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
  {
    didntMakeCreep = intelligentSpawner.spawnUpgrader(blueprint, notBusySpawns[curSpawn], mainRoom, true);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;

    didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], mainRoom, true);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  /*  //if main base is fucked, fix it first
    var harvesters = cacheFind.findCached(CONST.CACHEFIND_FINDHARVESTERS, mainRoom);
    var haulers = cacheFind.findCached(CONST.CACHEFIND_FINDHAULERS, mainRoom);
    //var harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == CONST.ROLE_HARVESTER && Game.rooms[creep.memory.workRoom] == mainRoom));
    //var haulers = _.filter(Game.creeps, (creep) => (creep.memory.role === CONST.ROLE_HAULER && Game.rooms[creep.memory.workRoom] == mainRoom));
    if (harvesters.length < 1 || haulers.length < 1)
    {
      return notBusySpawns.length;
    }
    var levelSum = 0;
    for (var i = 0; i < harvesters.length; ++i)
    {
      levelSum = levelSum + harvesters[i].memory.lvl;
    }
    if ((levelSum / harvesters.length) + 2 < 5 && mainRoom.controller.level > 3)
    {
      return notBusySpawns.length;
    }*/


  return curSpawn;

}

//done
function runMainRoomPriorityTwo(mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getMainBlueprint(mainRoom);
  let didntMakeCreep;
  if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
  {
    didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], mainRoom, false);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;

    didntMakeCreep = intelligentSpawner.spawnUpgrader(blueprint, notBusySpawns[curSpawn], mainRoom, false);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
  {
    didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], mainRoom, false);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  if (mainRoom.controller.level >= 6)
  {
    didntMakeCreep = intelligentSpawner.spawnMineralMiner(blueprint, notBusySpawns[curSpawn], mainRoom);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  //If storage is fullish, make a repairman. Should only apply to RCL 8 rooms.
  if (mainRoom.controller.level == 8)
  {
    var containersToFill = cacheFind.findCached(CONST.CACHEFIND_ENERGYCONTAINERSTOFILL, mainRoom);
    if (containersToFill.length == 0 || containersToFill.length == 1 && containersToFill[0].store[RESOURCE_ENERGY] > containersToFill[0].storeCapacity * 0.45)
    {
      if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
      {
        didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], mainRoom, true);
        if (!didntMakeCreep) curSpawn = curSpawn + 1;
        if (curSpawn >= notBusySpawns.length) return curSpawn;
      }
    }
  }


  return curSpawn;

}

//Done
function runAttackRoom(attackRoom, mainRoom, notBusySpawns, curSpawn)
{

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, attackRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, attackRoom);
  let didntMakeCreep;

  //if theres a hostile creep, GO GO GO KILLLLL
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    for (var z = 0; z < 3; ++z)
    {
      let makeSuper = false;
      if (hostileCreeps[0].owner.username == "Alcardian") makeSuper = true;
      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], attackRoom, 1, false, makeSuper);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }

  return curSpawn;

}

//Defense
function runExtensionRoomPriorityZero(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  var hostileBuildings = cacheFind.findCached(CONST.CACHEFIND_HOSTILEBUILDINGS, extRoom);

  let didntMakeCreep;
  if ((hostileCreeps.length > 0 || hostileBuildings.length > 0) && mainRoom.energyAvailable > mainRoom.energyCapacityAvailable / 2)
  {
    if (hostileCreeps.length > 0)
    {
      for (var z = 0; z < 3; ++z)
      {
        if (hostileCreeps[0].owner.username == "Invader" || hostileCreeps[0].owner.username == "Screeps")
        {
          var nonCombat = cacheFind.findCached(CONST.CACHEFIND_NONCOMBATCREEPS, extRoom);

          if (!(extRoom.controller.level > 0))
          {
            for (var v = 0; v < nonCombat.length; ++v)
            {
              nonCombat[v].memory.task = CONST.TASK_FLEE;
            }
          }
          let makeSuper = false;
          if (hostileCreeps[0].owner.username == "Alcardian") makeSuper = true;
          didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 1, false, makeSuper);
          if (!didntMakeCreep) curSpawn = curSpawn + 1;
          if (curSpawn >= notBusySpawns.length) return curSpawn;
        }
        /*else if (hostileCreeps[0].owner.username == "Patrik")
        {
          for (var g = 0; g < hostileCreeps.length; ++g)
          {
            var body = hostileCreeps[g].body;
            if (body.includes(ATTACK) || body.includes(RANGED_ATTACK))
            {
              didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 3, true);
              if (!didntMakeCreep) curSpawn = curSpawn + 1;
              if (curSpawn >= notBusySpawns.length) return curSpawn;
            }
          }
        }*/
        else
        {
          var nonCombat = cacheFind.findCached(CONST.CACHEFIND_NONCOMBATCREEPS, extRoom);
          var isDangerous = false;
          var dangerousCreep = 0;
          var shouldFleeFrom = false;
          for (var v = 0; v < hostileCreeps.length; ++v)
          {
            isDangerous = util.isDangerousCreep(hostileCreeps[v]);
            if (isDangerous)
            {
              break;
            }
          }
          for (var v = 0; v < hostileCreeps.length; ++v)
          {
            shouldFleeFrom = util.shouldFleeFrom(hostileCreeps[v]);
            if (shouldFleeFrom)
            {
              break;
            }
          }
          if (isDangerous)
          {
            if (!(extRoom.controller.level > 0))
            {
              if (shouldFleeFrom)
              {
                for (var v = 0; v < nonCombat.length; ++v)
                {
                  nonCombat[v].memory.task = CONST.TASK_FLEE;
                }
              }
            }
            let makeSuper = false;
            if (hostileCreeps[0].owner.username == "Alcardian") makeSuper = true;
            didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 3, true, makeSuper);
            if (!didntMakeCreep) curSpawn = curSpawn + 1;
            if (curSpawn >= notBusySpawns.length) return curSpawn;
          }

        }
      }
    }
    else
    {
      let makeSuper = false;
      if (hostileCreeps[0].owner.username == "Alcardian") makeSuper = true;
      didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], extRoom, 1, false, makeSuper);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }
  }
  return curSpawn;


}

function runOuterDefenseRoom(outerRoom, mainRoom, notBusySpawns, curSpawn)
{
  let didntMakeCreep;
  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, outerRoom);
  if (hostileCreeps.length > 0)
  {
    for (var i = 0; i < hostileCreeps.length; ++i)
    {
      if (util.isDangerousCreep(hostileCreeps[i]))
      {
        let makeSuper = false;
        if (hostileCreeps[0].owner.username == "Alcardian") makeSuper = true;
        didntMakeCreep = intelligentSpawner.spawnZergling(notBusySpawns[curSpawn], outerRoom, 2, true, makeSuper);
        if (!didntMakeCreep) curSpawn = curSpawn + 1;
        if (curSpawn >= notBusySpawns.length) return curSpawn;
      }
    }
  }
  return curSpawn;

}
//Harvesters + Haulers  + Reservers
function runExtensionRoomPriorityOne(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  if (hostileCreeps.length > 0) return curSpawn;

  let didntMakeCreep = intelligentSpawner.spawnHauler(blueprint, notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnHarvester(blueprint, notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;
}

function runExtensionRoomPriorityReservers(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  if (hostileCreeps.length > 0) return curSpawn;

  let didntMakeCreep = intelligentSpawner.spawnReserver(blueprint, notBusySpawns[curSpawn], extRoom);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
  {
    didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], extRoom, false);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  return curSpawn;
}

function runPowerlevelRoomPriorityZero(notBusySpawns, plRoom, curSpawn)
{
  if (plRoom)
  {
    if (plRoom.controller.level == 8)
    {
      plRoom.controller.unclaim();
    }
  }

  let blueprint = BLUEPRINTS.RCL_ALL_PL_CREEP;

  let didntMakeCreep = intelligentSpawner.spawnClaimer(blueprint, notBusySpawns[curSpawn], plRoom, true);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;

}

function runPowerlevelRoomPriorityOne(notBusySpawns, plRoom, curSpawn)
{
  let blueprint = BLUEPRINTS.RCL_ALL_PL_CREEP;

  let terminal = Game.getObjectById("5aa8b4592bf1663e2e9ca552");

  let spareEnergy = terminalLogic.getSpareEnergy();
  if (plRoom.storage && plRoom.storage.isActive())
  {
    console.log(plRoom.storage.store[RESOURCE_ENERGY]);
    spareEnergy = plRoom.storage.store[RESOURCE_ENERGY] + spareEnergy;

    let didntMakeCreep;
    let maxUpgraders = Math.floor(spareEnergy / 44000);
    console.log("SPARE: " + spareEnergy);
    console.log(maxUpgraders);

    if (terminal.store[RESOURCE_ENERGY] > 45000 && (cacheFind.findCached(CONST.CACHEFIND_ENERGYCONTAINERSTOFILL, plRoom).length > 1))
    {
      didntMakeCreep = intelligentSpawner.spawnEnergyTransferer(blueprint, notBusySpawns[curSpawn], plRoom, maxUpgraders, terminal);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }

    didntMakeCreep = intelligentSpawner.spawnUpgrader(blueprint, notBusySpawns[curSpawn], plRoom, false, maxUpgraders);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;

    if (terminal.store[RESOURCE_ENERGY] > 45000 && (cacheFind.findCached(CONST.CACHEFIND_ENERGYCONTAINERSTOFILL, plRoom).length > 0))
    {
      didntMakeCreep = intelligentSpawner.spawnEnergyTransferer(blueprint, notBusySpawns[curSpawn], plRoom, maxUpgraders, terminal);
      if (!didntMakeCreep) curSpawn = curSpawn + 1;
      if (curSpawn >= notBusySpawns.length) return curSpawn;
    }

    return curSpawn;


  }
}

function runPowerlevelRoomPriorityTwo(notBusySpawns, plRoom, curSpawn)
{
  let blueprint = BLUEPRINTS.RCL_ALL_PL_CREEP;

  let didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], plRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  didntMakeCreep = intelligentSpawner.spawnRepairman(blueprint, notBusySpawns[curSpawn], plRoom, false);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;


}
//Upgraders + builders + repairers + ???
function runExtensionRoomPriorityTwo(extRoom, mainRoom, notBusySpawns, curSpawn)
{
  let blueprint = getExtBlueprint(mainRoom);

  var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, extRoom);
  if (hostileCreeps.length > 0) return curSpawn;

  if (cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, mainRoom).length > 0)
  {
    let didntMakeCreep = intelligentSpawner.spawnBuilder(blueprint, notBusySpawns[curSpawn], extRoom, false);
    if (!didntMakeCreep) curSpawn = curSpawn + 1;
    if (curSpawn >= notBusySpawns.length) return curSpawn;
  }

  return curSpawn;
}

function runGuardRoom(extRoomName, mainRoom, notBusySpawns, curSpawn)
{

  let didntMakeCreep = intelligentSpawner.spawnGuard(notBusySpawns[curSpawn], extRoomName, 3);
  if (!didntMakeCreep) curSpawn = curSpawn + 1;
  if (curSpawn >= notBusySpawns.length) return curSpawn;

  return curSpawn;


}


module.exports = {
  //TODO: save and load this at some point rather then remaking it every time.
  init: function()
  {

    var flags = Game.flags;

    savedFlagLength = Object.keys(flags)
      .length;
    roomControllers = [];


    var flagNames = Object.keys(flags);

    //Roomcontrollers has list of RC names.
    //Each RC name has a bunch of room names
    //Each room name has the real room name attached to it.
    //I think this is good so that i can use what I name rooms to decide behavior
    for (var i = 0; i < flagNames.length; ++i)
    {
      var splitFlag = flagNames[i].split("-");
      if (splitFlag[0] == "RC" && splitFlag.length == 3)
      {
        if (roomControllers[splitFlag[1]] == undefined)
        {
          roomControllers[splitFlag[1]] = [];
        }
        var rc = roomControllers[splitFlag[1]];
        if (flags[flagNames[i]].room != undefined)
        {
          rc[splitFlag[2]] = flags[flagNames[i]].room.name;
        }
        else
        {
          rc[splitFlag[2]] = flags[flagNames[i]].pos.roomName;
        }
        roomControllers[splitFlag[1]] = rc;
      }
    }
    //console.log(Object.keys(roomControllers));
    return roomControllers;


  },

  runRoomController: function(roomController, rcName)
  {
    var rooms = Object.keys(roomController);

    var didNothingLast = didNothingLastTick[rcName];

    if (didNothingLast == undefined)
    {
      didNothingLast = 0;
      didNothingLastTick[rcName] = 0;
    }

    if (didNothingLast > 0)
    {
      //  console.log(rcName + " " + didNothingLast);
      didNothingLastTick[rcName] = didNothingLast - 1;
      return;
    }

    var mainBaseRoom = Game.rooms[roomController["M"]];
    if (mainBaseRoom == undefined)
    {
      console.log(rcName);
      console.log("ROOM CONTROLLER MISSING MAIN BASE FLAG. ABORT. ABORT. ABORT");
      return;
    }

    //Zergling assignement code main rooms
    var hostileCreeps = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, mainBaseRoom);
    {
      if (hostileCreeps.length > 0)
      {
        intelligentSpawner.spawnZergling(undefined, mainBaseRoom, 5, false);
      }
    }
    //FUCKING FORCE AN ENERGY energyTransferers
    let energyTransferers = _.filter(Game.creeps, (creep) => (creep.memory.homeRoom == mainBaseRoom.name && (creep.memory.role === CONST.ROLE_ENERGYTRANSFERER)));
    if (energyTransferers.length < 1)
    {
      let haulers = _.filter(Game.creeps, (creep) => (creep.memory.homeRoom == mainBaseRoom.name && creep.memory.homeRoom == creep.memory.workRoom && (creep.memory.role === CONST.ROLE_HAULER) && creep.memory.task != CONST.TASK_SPAWNING));

      if (haulers.length == 0)
      {
        haulers = _.filter(Game.creeps, (creep) => (creep.memory.homeRoom == mainBaseRoom.name && (creep.memory.role === CONST.ROLE_HAULER) && creep.memory.task != CONST.TASK_SPAWNING));
      }
      if (haulers.length > 0)
      {
        haulers[0].memory.workRoom = mainBaseRoom.name;
        haulers[0].memory.homeRoom = mainBaseRoom.name;
        haulers[0].memory.role = CONST.ROLE_ENERGYTRANSFERER;
        haulers[0].memory.task = CONST.ROLE_ENERGYTRANSFERER;
        haulers[0].memory.targetID = undefined;
        console.log("STOLE A FUCKING HAULER");
      }
    }
    let extensionRooms = [];
    let colonyRooms = [];
    let attackRooms = [];
    let disassembleFlags = [];
    let buildRoads = [];
    let outerWarningRooms = [];
    let powerlevelRooms = [];
    let guardRooms = [];

    let notBusySpawns = util.getNotBusySpawns(mainBaseRoom);

    while (notBusySpawns.length > 1)
    {
      notBusySpawns.pop();
    }
    //if all spawns are spawning, no point in doing any of this.
    if (notBusySpawns.length == 0)
    {
      return;
    }
    //SOMEONE PLEASE TELL ME WHY I NEEDED TO ADD THIS CHECK. AS FAR AS I KNOW IT SHOULD NEVER EVER EVER MATTER. BUT ONCE EVERY 10 HOURS IT DOES.
    if (notBusySpawns[0] == undefined || notBusySpawns[0] == null)
    {
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      console.log("@#%$#%@#%@#^$@%@#&*(%@#%@%^*@#%#%%@#@#@#%@#%@#$&*(@#$@#%$))");
      return;
    }
    //only do one spawn at time for now.
    //notBusySpawns = [notBusySpawns[0]];

    var curSpawn = 0;

    //Find flags that correspond to certain rooms and categorize them.
    for (let i = 0; i < rooms.length; ++i)
    {
      let roomName = rooms[i];
      let room = Game.rooms[roomController[roomName]];
      let roomType = roomName.charAt(0);
      if (room == undefined && roomType != "D")
      {
        let flagName = "RC-" + rcName + "-" + roomName;
        curSpawn = makeScoutForFlag(flagName, mainBaseRoom, notBusySpawns, curSpawn);
        if (curSpawn > notBusySpawns.length) return;
      }
      else
      {
        switch (roomType)
        {
          case "P":
            powerlevelRooms.push(room);
            break;
          case "C":
            colonyRooms.push(room);
            break;
          case "E":
            extensionRooms.push(room);
            break;
          case "A":
            attackRooms.push(room);
            break;
          case "O":
            outerWarningRooms.push(room);
            break;
            a
          case "B":
            console.log("found flag");
            let flagNamesss = "RC-" + rcName + "-" + roomName;
            Game.flags[flagNamesss].remove();
            buildRoads.push(room);
            break;
          case "R":
            let flagName = "RC-" + rcName + "-" + roomName;
            disassembleFlags.push(flagName);
            break;
          case "D":
            guardRooms.push(roomController[roomName]);
            break;
        }
      }
    }
    recycleCreeps(mainBaseRoom);
    //Run building code:
    for (let i = 0; i < buildRoads.length; ++i)
    {
      console.log("BuildingRoads");
      roadBuilder.buildBasicRoads(mainBaseRoom, extensionRooms);
    }

    curSpawn = runMainRoomPriorityZero(mainBaseRoom, notBusySpawns, curSpawn);
    if (curSpawn >= notBusySpawns.length) return;

    //Run Priority Zero - Defense + haulers
    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityZero(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < powerlevelRooms.length; ++i)
    {
      curSpawn = runPowerlevelRoomPriorityZero(notBusySpawns, powerlevelRooms[i], curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //run outer warning rooms
    for (let i = 0; i < outerWarningRooms.length; ++i)
    {
      curSpawn = runOuterDefenseRoom(outerWarningRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Priority One Spawns - Haulers + Harvester + healer
    curSpawn = runMainRoomPriorityOne(mainBaseRoom, notBusySpawns, curSpawn);
    if (curSpawn >= notBusySpawns.length) return;


    for (let i = 0; i < extensionRooms.length; ++i)
    {

      curSpawn = runExtensionRoomPriorityOne(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //run Reservers
    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityReservers(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < powerlevelRooms.length; ++i)
    {
      curSpawn = runPowerlevelRoomPriorityOne(notBusySpawns, powerlevelRooms[i], curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < colonyRooms.length; ++i)
    {
      curSpawn = runColonyRoomPriorityOne(colonyRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Attack Rooms
    for (let i = 0; i < attackRooms.length; ++i)
    {
      curSpawn = runAttackRoom(attackRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Priority Two Spawns - Builders/Repairmen/upgraders
    curSpawn = runMainRoomPriorityTwo(mainBaseRoom, notBusySpawns, curSpawn);
    if (curSpawn >= notBusySpawns.length) return;

    for (let i = 0; i < extensionRooms.length; ++i)
    {
      curSpawn = runExtensionRoomPriorityTwo(extensionRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //run guard Rooms
    for (let i = 0; i < guardRooms.length; ++i)
    {
      curSpawn = runGuardRoom(guardRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < colonyRooms.length; ++i)
    {
      curSpawn = runColonyRoomPriorityTwo(colonyRooms[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    for (let i = 0; i < powerlevelRooms.length; ++i)
    {
      curSpawn = runPowerlevelRoomPriorityTwo(notBusySpawns, powerlevelRooms[i], curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    //Run Priority Three Spawns - misc
    for (let i = 0; i < disassembleFlags.length; ++i)
    {
      curSpawn = runDisassemblyFlag(disassembleFlags[i], mainBaseRoom, notBusySpawns, curSpawn);
      if (curSpawn >= notBusySpawns.length) return;
    }

    didNothingLastTick[rcName] = 5;


    //console.log(mainBaseRoom + " Had nothing to spawn");
    return;

  }

};
