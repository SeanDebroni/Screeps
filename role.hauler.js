'use strict';
var util = require("util");
var cacheFind = require('cacheFind');
const CONST = require("CONSTANTS");

var roleHauler = {
  //
  //moves energy from harvester to container
  run: function (creep)
  {
    //If the hauler is full enough, return the energy to base.
    //IMPORTANT : Tied toa check in pickupenergy.
    if (creep.carry.energy > creep.carryCapacity * 0.95)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLBASE;
      return;
    }

    //If you have a Harvester assigned to pickup energy from;
    var harvName = creep.memory.assignedHarvesterName;
    if (harvName != undefined)
    {
      var harv = Game.creeps[harvName];

      //if we have an assigned harvesters
      if (harv != undefined)
      {
        //if we have an assigned harvesters
        var whatsThere = harv.room.lookAt(harv.pos);
        for (var i = 0; i < whatsThere.length; ++i)
        {
          if (whatsThere[i].type == 'structure' && whatsThere[i].structure.structureType == STRUCTURE_CONTAINER)
          {
            if (whatsThere[i].structure.store[RESOURCE_ENERGY] > 20)
            {
              creep.memory.targetID = whatsThere[i].structure.id;
              creep.memory.fillResourceType = RESOURCE_ENERGY;
              creep.memory.task = CONST.TASK_FILLFROMTARGETSTRUCTURE;
              return;
            }
          }
          if (whatsThere[i].type === 'energy')
          {
            if (whatsThere[i].energy.amount > 20)
            {
              //console.log(creep.name + " going to priority target");
              creep.memory.targetID = whatsThere[i].energy.id;
              creep.memory.task = CONST.TASK_PICKUPENERGY;
              return;
            }
          }
        }
      }
      else
      {
        creep.memory.assignedHarvesterName = undefined;
      }
    }

    //try to find harvester next to source;
    else if (creep.memory.assignedSourceID != undefined)
    {
      var source = Game.getObjectById(creep.memory.assignedSourceID);
      if (source == undefined || source == null)
      {
        if (Game.rooms[creep.memory.workRoom] == undefined)
        {
          util.moveToRoom(creep, creep.memory.workRoom);
          return;
        }
        console.log(creep.memory.assignedSourceID);
        console.log("ERRRRRRRRRRRRRRRRRR");
        var source = cacheFind.findCached(CONST.CACHEFIND_SOURCES, util.getWorkRoom(creep));
        creep.memory.assignedSourceID = source[0].id;
        return;
      }
      var whatsThere = source.room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
      for (var i = 0; i < whatsThere.length; ++i)
      {
        if (whatsThere[i].type == 'creep' && whatsThere[i].creep.my)
        {
          if (whatsThere[i].creep.memory.task == CONST.TASK_MINEENERGY)
          {
            creep.memory.assignedHarvesterName = whatsThere[i].creep.name;
          }
        }
      }
    }

    //Find generic dropped energy in workRoom
    var droppedEnergy = cacheFind.findCached(CONST.CACHEFIND_DROPPEDENERGY, util.getWorkRoom(creep));

    //If there is energy dropped in workRoom, randomly find a pile of it and go pick it up.
    if (droppedEnergy.length > 0)
    {
      creep.memory.targetID = droppedEnergy[Math.floor(Math.random() * droppedEnergy.length)].id;
      creep.memory.task = CONST.TASK_PICKUPENERGY;
      return;
    }

    //Find containers in EXTENSIONS
    if (creep.workRoom != creep.homeRoom)
    {
      var energyContainers = cacheFind.findCached(CONST.CACHEFIND_CONTAINERSWITHENERGY, util.getWorkRoom(creep));

      if (energyContainers.length > 0)
      {
        creep.memory.targetID = energyContainers[Math.floor(Math.random() * droppedEnergy.length)].id;
        creep.memory.fillResourceType = RESOURCE_ENERGY;
        creep.memory.task = CONST.TASK_FILLFROMTARGETSTRUCTURE;
        return;
      }
    }

    //If the hauler is empty, and there is no dropped energy to pick up
    if (creep.carry.energy == 0)
    {
      //If spawns need energy, then fill from storage.
      if (util.getHomeRoom(creep)
        .energyAvailable != util.getHomeRoom(creep)
        .energyCapacityAvailable)
      {
        creep.memory.task = CONST.TASK_FILLFROMBASE;
        return;
      }
      //otherwise idle.
      var flag = Game.flags[creep.memory.homeRoom + "idle"];
      if (flag != undefined && flag != null)
      {
        creep.moveTo(flag,
        {
          reusePath: 10
        });
        return;
      }
    }
    //if not full, but has some and no more to pickup and dying soon, then go fill base.
    else if (creep.ticksToLive < 100)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLBASE;
      return;
    }
  }

};
module.exports = roleHauler;