
const CONST = require('CONSTANTS');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleScout = require('role.scout');

var taskFillBase = require('task.fillBase');
var taskMineEnergy = require('task.mineEnergy');
var taskPickUpEnergy = require('task.pickUpEnergy');
var taskRecycle = require('task.recycle');
var taskWaitingToBeRecycled = require('task.waitingToBeRecycled');
var taskSpawning = require('task.spawning');
var taskFillFromBase = require('task.fillFromBase');
var taskIdle = require ('task.idle');
var taskUpgradeRoom = require('task.upgradeRoom');
var taskBuild = require ('task.build');
var taskMoveToTarget = require('task.moveToTarget');

const profiler = require('profiler');



var towerLogic = require('towerLogic');
var intelligentSpawner = require('intelligentSpawner')
var util = require('util');

var cacheFind = require('cacheFind');
var cacheMoveTo = require('cacheMoveTo');

profiler.enable();

module.exports.loop = function ()
{
  profiler.wrap(function() {
    console.log(" ");

  
       console.log(Game.time);

  //console.log("CPU limit: "+ Game.cpu.limit);
  //console.log("CPU ticklimit: "+ Game.cpu.tickLimit);
  //console.log("CPU bucket: "+ Game.cpu.bucket);
      var start = new Date().getTime();


  var a = Game.time & 1023;
  if(a==0)
  {
      cacheMoveTo.cacheMoveToClear();
  }
  cacheFind.cacheFindClear();
  var time = Game.time;
  var rand = Math.floor(Math.random() *100);
  util.cleanUpDeadCreeps();

    for(var room_name in Game.rooms) {
        var towers = cacheFind.findCached(CONST.CACHEFIND_MYTOWERS, Game.rooms[room_name]);

        for(var i = 0; i<towers.length; ++i)
        {
          towerLogic.runTower(towers[i]);
        }

        for(var spawn_name in Game.spawns) {
            var spawn = Game.spawns[spawn_name];
            if(true)
            {
              intelligentSpawner.recycleCreeps(spawn);
              var notSpawning = true;
              if(spawn.spawning != null) notSpawning = false;
              if(notSpawning) notSpawning = intelligentSpawner.spawnHauler(spawn, spawn.room); //only spawns if needed to haul
                var end3 = new Date().getTime();
                var time3 = end3 - start;
               console.log("time difference after spawnHaul: " + time3);

              if(notSpawning) notSpawning = intelligentSpawner.spawnHarvester(spawn, spawn.room);
                              var end4 = new Date().getTime();
                var time4 = end4 - start;
               console.log("time difference after spawnHarv: " + time4);
              if(notSpawning) notSpawning = intelligentSpawner.spawnBuilder(spawn, spawn.room);
                              var end5 = new Date().getTime();
                var time5 = end5 - start;
              console.log("time difference after spawnBuild: " + time5);
              if(notSpawning) notSpawning = intelligentSpawner.spawnUpgrader(spawn, spawn.room);

                                            var end6 = new Date().getTime();
                var time6 = end6 - start;
               console.log("time difference after spawnUPG: " + time6);
               if(notSpawning) notspawning = intelligentSpawner.spawnScout(spawn, spawn.room);
            }


        }
    }
         var end2 = new Date().getTime();
    var time2 = end2 - start;
    console.log("time difference after spawnAll: " + time2);

    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        switch(creep.memory.task)
        {
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
          default:
            break;
        }
    }
         var end1 = new Date().getTime();
    var time1 = end1 - start;
    console.log("time differenceafter role: " + time1);
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];

        switch(creep.memory.task)
        {

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
        default:
          break;
      }
  }

      //console.log("CPU limit: "+ Game.cpu.limit);
 // console.log("CPU ticklimit: "+ Game.cpu.tickLimit);
  //console.log("CPU bucket: "+ Game.cpu.bucket);

     var end = new Date().getTime();
    var time = end - start;
    console.log("time difference: " + time);
     });

}
