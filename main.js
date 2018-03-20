'use strict';
const CONST = require('CONSTANTS');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleScout = require('role.scout');
var roleReserver = require('role.reserver');
var roleZergling = require('role.zergling');
var roleDisassembleFlag = require('role.disassembleFlag');
var roleRepairman = require('role.repairman');
var roleBaseHealer = require('role.baseHealer');
var roleUpgradeDancer = require('role.upgradeDancer');
var roleEnergyTransferer = require('role.energyTransferer');
var roleMineralMiner = require('role.mineralMiner');
var roleClaimer = require('role.claimer');

var taskFillBase = require('task.fillBase');
var taskMineEnergy = require('task.mineEnergy');
var taskPickUpEnergy = require('task.pickUpEnergy');
var taskRecycle = require('task.recycle');
var taskWaitingToBeRecycled = require('task.waitingToBeRecycled');
var taskSpawning = require('task.spawning');
var taskFillFromBase = require('task.fillFromBase');
var taskIdle = require('task.idle');
var taskUpgradeRoom = require('task.upgradeRoom');
var taskBuild = require('task.build');
var taskMoveToTarget = require('task.moveToTarget');
var taskReserve = require('task.reserve');
var taskKill = require('task.kill');
var taskDisassemble = require('task.disassemble');
var taskRepair = require('task.repair');
var taskFillFromTargetStructure = require('task.fillFromTargetStructure');
var taskHealTarget = require('task.healTarget');
var taskFlee = require('task.flee');
var taskUpgradeDance = require('task.upgradeDance');
var taskMineMineral = require('task.mineMineral');
var taskFillTargetStructure = require('task.fillTargetStructure');

var towerLogic = require('towerLogic');
var intelligentSpawner = require('intelligentSpawner');
var roomControllerLogic = require('roomControllerLogic');
var util = require('util');
var roadMaintainer = require('roadMaintainer');
var terminalLogic = require('terminalLogic');

var cacheFind = require('cacheFind');
var cachedGetDistance = require('cachedGetDistance');
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


let gTaskAvg = {};
let gTaskNum = {};
let codeAge = 0;
let manualGC = 0;
module.exports.loop = function ()
{
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

  //let z = Object.keys(global);
  //console.log(z.length);

  let cpuTimesUsedArr = [];
  var cpuUsedOld = Game.cpu.getUsed();
  var cpuUsedNew = Game.cpu.getUsed();
  console.log("Baseline used: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  var rand = Math.floor(Math.random() * 100);

  cachedGetDistance.cachedGetDistanceLoad();
  cacheFind.cacheFindClear();
  util.cleanUpDeadCreeps();


  /*
    var cenU = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_UPGRADER)));
    var cenB = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_BUILDER)));
    var cenH = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_HAULER)));
    var cenHarv = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_HARVESTER)));
    var cenZerg = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_ZERGLING)));
    var cenScout = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_SCOUT)));
    var cenR = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_REPAIRMAN)));
    var cenRes = _.filter(Game.creeps, (creep) => ((creep.memory.role === CONST.ROLE_RESERVER)));
    var cenOther = _.filter(Game.creeps, (creep) => ((creep.memory.role != CONST.ROLE_RESERVER &&
      creep.memory.role != CONST.ROLE_REPAIRMAN &&
      creep.memory.role != CONST.ROLE_SCOUT &&
      creep.memory.role != CONST.ROLE_ZERGLING &&
      creep.memory.role != CONST.ROLE_HARVESTER &&
      creep.memory.role != CONST.ROLE_HAULER &&
      creep.memory.role != CONST.ROLE_BUILDER &&
      creep.memory.role != CONST.ROLE_UPGRADER
    )));
    console.log("sum : " + (cenOther.length + cenHarv.length + cenU.length + cenB.length + cenH.length + cenZerg.length + cenScout.length + cenR.length + cenRes.length));
    console.log("Num weird: " + cenOther.length);
    console.log("Num Harvesters: " + cenHarv.length);
    console.log("Num Upgraderss: " + cenU.length);
    console.log("Num Builders: " + cenB.length);
    console.log("Num Haulers: " + cenH.length);
    console.log("Num Zerg: " + cenZerg.length);
    console.log("Num Scout: " + cenScout.length);
    console.log("Num Repairman: " + cenR.length);
    console.log("num reser: " + cenRes.length);*/

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for Util: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  for (var room_name in Game.rooms)
  {
    var towers = cacheFind.findCached(CONST.CACHEFIND_MYTOWERS, Game.rooms[room_name]);
    towerLogic.runTowers(towers);
  }
  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for Towers: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;


  var allRoomControllers = roomControllerLogic.init();

  var allRoomControllersKeys = Object.keys(allRoomControllers);
  for (var i = 0; i < allRoomControllersKeys.length; ++i)
  {
    var roomController = allRoomControllers[allRoomControllersKeys[i]];
    roomControllerLogic.runRoomController(roomController, allRoomControllersKeys[i]);
  }

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for spawning logic: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  for (var i = 0; i < allRoomControllersKeys.length; ++i)
  {
    var roomController = allRoomControllers[allRoomControllersKeys[i]];
    var didWork = roadMaintainer.maintainRoads(roomController, allRoomControllersKeys[i]);
    if (didWork) break;
  }

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for roadMaintainance: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  for (var i = 0; i < allRoomControllersKeys.length; ++i)
  {
    var roomController = allRoomControllers[allRoomControllersKeys[i]];
    terminalLogic.update(roomController, allRoomControllersKeys[i]);
  }
  terminalLogic.doPowerLevelEnergyBalance();
  terminalLogic.doSellMinerals();

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for terminalLogic: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;

  //  var roleTimes = {};
  //var roleNums = {};
  for (var name in Game.creeps)
  {
    let roleStart = Game.cpu.getUsed();

    var creep = Game.creeps[name];
    switch (creep.memory.task)
    {
    case CONST.ROLE_MINERALMINER:
      roleMineralMiner.run(creep);
      break;
    case CONST.ROLE_REPAIRMAN:
      roleRepairman.run(creep);
      break;
    case CONST.ROLE_DISASSEMBLEFLAG:
      roleDisassembleFlag.run(creep);
      break;
    case CONST.ROLE_HARVESTER:
      roleHarvester.run(creep);
      break;
    case CONST.ROLE_UPGRADER:
      roleUpgrader.run(creep);
      break;
    case CONST.ROLE_BUILDER:
      roleBuilder.run(creep);
      break;
    case CONST.ROLE_HAULER:
      roleHauler.run(creep);
      break;
    case CONST.ROLE_SCOUT:
      roleScout.run(creep);
      break;
    case CONST.ROLE_RESERVER:
      roleReserver.run(creep);
      break;
    case CONST.ROLE_ZERGLING:
      roleZergling.run(creep);
      break;
    case CONST.ROLE_BASEHEALER:
      roleBaseHealer.run(creep);
      break;
    case CONST.ROLE_UPGRADEDANCER:
      roleUpgradeDancer.run(creep);
      break;
    case CONST.ROLE_ENERGYTRANSFERER:
      roleEnergyTransferer.run(creep);
      break;
    case CONST.ROLE_CLAIMER:
      roleClaimer.run(creep);
      break;
    default:
      break;
    }
    /*
    let roleEnd = Game.cpu.getUsed();
    let role = creep.memory.task;
    if (roleNums[role] != undefined)
    {
      roleTimes[role] = roleTimes[role] + (roleEnd - roleStart);
      roleNums[role] = roleNums[role] + 1;
    }
    else
    {
      roleTimes[role] = (roleEnd - roleStart);
      roleNums[role] = 1;
    }*/
  }

  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for Roles: " + (cpuUsedNew - cpuUsedOld));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  cpuUsedOld = cpuUsedNew;
  var taskTimes = {};
  var taskNums = {};
  let taskEnd;
  let taskStart;
  for (var name in Game.creeps)
  {
    taskStart = Game.cpu.getUsed();
    var creep = Game.creeps[name];
    var isTask = true;
    let task = creep.memory.task;
    if (task == undefined)
    {
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(creep.name);
      console.log(creep.memory.role);
      console.log(creep.memory.workRoom);
    }
    switch (creep.memory.task)
    {
    case CONST.TASK_FILLTARGETSTRUCTURE:
      taskFillTargetStructure.run(creep);
      break;
    case CONST.TASK_MINEMINERAL:
      taskMineMineral.run(creep);
      break;
    case CONST.TASK_REPAIR:
      taskRepair.run(creep);
      break;
    case CONST.TASK_DISASSEMBLE:
      taskDisassemble.run(creep);
      break;
    case CONST.TASK_KILL:
      taskKill.run(creep);
      break;
    case CONST.TASK_FILLBASE:
      taskFillBase.run(creep);
      break;
    case CONST.TASK_MINEENERGY:
      taskMineEnergy.run(creep);
      break;
    case CONST.TASK_PICKUPENERGY:
      taskPickUpEnergy.run(creep);
      break;
    case CONST.TASK_RECYCLE:
      taskRecycle.run(creep);
      break;
    case CONST.TASK_WAITINGTOBERECYCLED:
      taskWaitingToBeRecycled.run(creep);
      break;
    case CONST.TASK_SPAWNING:
      taskSpawning.run(creep);
      break;
    case CONST.TASK_IDLE:
      taskIdle.run(creep);
      break;
    case CONST.TASK_BUILD:
      taskBuild.run(creep);
      break;
    case CONST.TASK_FILLFROMBASE:
      taskFillFromBase.run(creep);
      break;
    case CONST.TASK_UPGRADEROOM:
      taskUpgradeRoom.run(creep);
      break;
    case CONST.TASK_MOVETOTARGET:
      taskMoveToTarget.run(creep);
      break;
    case CONST.TASK_RESERVE:
      taskReserve.run(creep);
      break;
    case CONST.TASK_FILLFROMTARGETSTRUCTURE:
      taskFillFromTargetStructure.run(creep);
      break;
    case CONST.TASK_HEALTARGET:
      taskHealTarget.run(creep);
      break;
    case CONST.TASK_FLEE:
      taskFlee.run(creep);
      break;
    case CONST.TASK_UPGRADEDANCE:
      taskUpgradeDance.run(creep);
      break;
    default:
      isTask = false;
      break;
    }
    if (isTask)
    {
      taskEnd = Game.cpu.getUsed();
      if (taskNums[task] != undefined)
      {
        taskTimes[task] = taskTimes[task] + (taskEnd - taskStart);
        taskNums[task] = taskNums[task] + 1;
      }
      else
      {
        taskTimes[task] = (taskEnd - taskStart);
        taskNums[task] = 1;
      }
    }
  }
  cachedGetDistance.cachedGetDistanceSave();
  /*let debugKeysR = Object.keys(roleTimes);
  for (let i = 0; i < debugKeysR.length; ++i)
  {
    console.log("Time Average for role " + debugKeysR[i] + ": " + (roleTimes[debugKeysR[i]] / roleNums[debugKeysR[i]])
      .toFixed(3));
  }*/
  /*  let debugKeys = Object.keys(taskTimes);
    for (let i = 0; i < debugKeys.length; ++i)
    {
      if (gTaskAvg[debugKeys[i]] == undefined)
      {
        gTaskAvg[debugKeys[i]] = taskTimes[debugKeys[i]] / taskNums[debugKeys[i]];
        gTaskNum[debugKeys[i]] = taskNums[debugKeys[i]];
      }
      else
      {
        gTaskAvg[debugKeys[i]] = ((gTaskAvg[debugKeys[i]] * gTaskNum[debugKeys[i]]) + taskTimes[debugKeys[i]]) / (gTaskNum[debugKeys[i]] + taskNums[debugKeys[i]]);
        gTaskNum[debugKeys[i]] = gTaskNum[debugKeys[i]] + taskNums[debugKeys[i]];
      }


      console.log("Time Average|Sum for task " + debugKeys[i] + ": " + (taskTimes[debugKeys[i]] / taskNums[debugKeys[i]])
        .toFixed(3) + "|" + (taskTimes[debugKeys[i]])
        .toFixed(3));
    }

    for (let i = 0; i < debugKeys.length; ++i)
    {
      console.log("global Time Average|Sum for task " + debugKeys[i] + ": " + (gTaskAvg[debugKeys[i]])
        .toFixed(3) + "|" + (gTaskNum[debugKeys[i]] * gTaskAvg[debugKeys[i]])
        .toFixed(3));
    }*/
  cpuUsedNew = Game.cpu.getUsed();
  console.log("CPU used for tasks: " + (cpuUsedNew - cpuUsedOld)
    .toFixed(3));
  cpuTimesUsedArr.push(cpuUsedNew - cpuUsedOld);
  console.log("CPU used Total: " + cpuUsedNew.toFixed(3));
  let cpuUsedSum = _.sum(cpuTimesUsedArr);
  console.log("CPU used Sum: " + (cpuUsedSum));

  //Try catch is in case not on IVM, getHeapStatistics doesn't exist if not in IVM (isolated virtual machine)
  try
  {
    var stats = (Game.cpu.getHeapStatistics());
    var keys = Object.keys(stats);
    /*for (var i = 0; i < keys.length; ++i)
    {
      console.log(keys[i] + ": " + (stats[keys[i]]));
    }*/
    console.log("Used " + (stats.total_heap_size / stats.heap_size_limit));
    let otherUsed = ((stats.total_heap_size + stats.externally_allocated_size) / stats.heap_size_limit);
    console.log("Other used:" + (otherUsed));
    console.log("Age: " + codeAge);

    if (otherUsed > 0.4 && (cpuUsedSum / Game.cpu.limit) < 0.65 && (Game.cpu.tickLimit - cpuUsedSum) > 200)
    {
      let cpuUsedPreGC = Game.cpu.getUsed();
      gc();
      let cpuUsedPostGC = Game.cpu.getUsed();
      console.log("USED " + (cpuUsedPostGC - cpuUsedPreGC) + " CPU on gc");
      console.log("new sum is " + ((cpuUsedPostGC - cpuUsedPreGC) + cpuUsedSum));
      manualGC = manualGC + 1;
    }
    console.log("ManGC: " + manualGC);


  }
  catch (err)
  {}





  var maxCodeAge = Memory.maxCodeAge;
  if (maxCodeAge == undefined)
  {
    maxCodeAge = 0;
  }
  codeAge = codeAge + 1;
  if (codeAge > maxCodeAge)
  {
    Memory.maxCodeAge = codeAge;
  }
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  cpuUsedOld = cpuUsedNew;


}