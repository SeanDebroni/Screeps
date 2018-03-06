'use strict';
const CONST = require('CONSTANTS');
var util = require('util');
var cacheMoveTo = require('cacheMoveTo');

//Create with memory sID which is the id of the source to harvest
var roleHarvester = {
  run: function (creep)
  {
    var source = Game.getObjectById(creep.memory.sID);

    //If we cannot find the source, and are not in the same room as it should be in, move to that room.
    if (source == undefined && creep.memory.workRoom != creep.room.name)
    {
      util.moveToRoom(creep, creep.memory.workRoom);
      return;
    }

    if (creep.memory.isHarvesterContainer == undefined)
    {
      creep.memory.isHarvesterContainer = false;
      var whatsThere = source.room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
      for (var i = 0; i < whatsThere.length; ++i)
      {
        if (whatsThere[i].type == 'structure' && whatsThere[i].structure.structureType == STRUCTURE_CONTAINER)
        {
          creep.memory.isHarvesterContainer = true;
          creep.memory.harvesterContainerX = whatsThere[i].structure.pos.x;
          creep.memory.harvesterContainerY = whatsThere[i].structure.pos.y;
          break;
        }
      }
    }

    if (creep.memory.isHarvesterContainer)
    {
      if (creep.pos.x == creep.memory.harvesterContainerX && creep.pos.y == creep.memory.harvesterContainerY && creep.room.name == creep.memory.workRoom)
      {
        creep.harvest(source);
        creep.memory.task = CONST.TASK_MINEENERGY;
      }
      else
      {
        creep.moveTo((new RoomPosition(creep.memory.harvesterContainerX, creep.memory.harvesterContainerY, creep.memory.workRoom)),
        {
          reusePath: 6
        });
      }
      return;
    }
    //Try to harvest the source
    var res = creep.harvest(source);

    //If not successful, move to the Source
    if (res != 0)
    {
      creep.moveTo(source,
      {
        reusePath: 5
      });
    }
    //If sucessful, sit there forever and mine.
    else
    {
      creep.memory.task = CONST.TASK_MINEENERGY;
    }
  }
};
module.exports = roleHarvester;