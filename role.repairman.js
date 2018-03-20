'use strict';
const CONST = require('CONSTANTS');
var cacheFind = require('cacheFind');
var util = require('util');

var roleRepairman = {
  run: function (creep)
  {
    var energyStorageStructures = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.homeRoom]);

    //if creep is empty and storage is not, fill up the creep.
    if (creep.carry.energy == 0 && energyStorageStructures.length > 0)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLFROMBASE;
      return;
    }

    //containers first
    if (creep.memory.workRoom != creep.memory.homeRoom)
    {
      var containers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, Game.rooms[creep.memory.workRoom]);
      for (var i = 0; i < containers.length; ++i)
      {
        if (containers[i].hits < containers[i].hitsMax * 0.7)
        {
          creep.memory.targetID = containers[i].id;
          creep.memory.task = CONST.TASK_REPAIR;
          return;
        }
      }
    }
    var damagedStructures = cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, Game.rooms[creep.memory.workRoom]);

    //if there is something to repair, repair it.
    if (damagedStructures.length > 0)
    {
      if (creep.memory.homeRoom != creep.memory.workRoom && creep.room.name == creep.memory.workRoom)
      {
        let min = 1000;
        let targ = -1;
        for (let i = 0; i < damagedStructures.length; ++i)
        {
          let dist = creep.pos.getRangeTo(damagedStructures[i]);
          if (dist < min)
          {
            targ = i;
            min = dist;
          }
          if (min < 8) break;
        }
        creep.memory.targetID = damagedStructures[targ].id;
      }
      else
      {
        creep.memory.targetID = damagedStructures[Math.floor(Math.random() * damagedStructures.length)].id;
      }
      creep.memory.task = CONST.TASK_REPAIR;
      return;
    }
    //else there is nothing to repair, so do other stuff
    else
    {
      //if its a mainroom repairman, then upgrade
      if (creep.memory.workRoom == creep.memory.homeRoom)
      {
        creep.memory.task = CONST.TASK_UPGRADEROOM;
        return;
      }

      //if its an ext roleRepairman
      if (Game.rooms[creep.memory.workRoom] != undefined)
      {
        //Go recycle yourself.
        creep.memory.task = CONST.TASK_RECYCLE;
        creep.memory.role = CONST.TASK_RECYCLE;
        creep.memory.targetID = -1;
        return;
      }
      else
      {
        util.moveToRoom(creep, creep.memory.workRoom);
      }
    }

    return;

  }
};
module.exports = roleRepairman;