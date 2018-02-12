var util = require("util");
var cacheFind = require('cacheFind');
const CONST = require("CONSTANTS");

var roleHauler = {
  //
  //moves energy from harvester to container
  run: function (creep)
  {
    if (creep.carry.energy > creep.carryCapacity * 0.8)
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLBASE;
      return;
    }
    else if (creep.carry.energy <= (creep.carryCapacity * 0.8))
    {
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
      }
      //try to find harvester next to source;
      else if (creep.memory.assignedSourceID != undefined)
      {
        var source = Game.getObjectById(creep.memory.assignedSourceID);
        if (source == undefined || source == null)
        {
          console.log(creep.memory.assignedSourceID);
          console.log("ERRRRRRRRRRRRRRRRRR");
          var source = cacheFind.findCached(CONST.CACHEFIND_SOURCES, util.getWorkRoom(creep));
          creep.memory.assignedSourceID = source[0].id;
          return;
        }
        var whatsThere = source.room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        for (var i = 0; i < whatsThere.length; ++i)
        {
          if (whatsThere[i].type == 'creep')
          {
            if (whatsThere[i].creep.memory.task == CONST.TASK_MINEENERGY)
            {
              creep.memory.assignedHarvesterName = whatsThere[i].creep.name;
            }
          }
        }
      }


      var droppedEnergy = cacheFind.findCached(CONST.CACHEFIND_DROPPEDENERGY, util.getWorkRoom(creep));
      if (droppedEnergy.length > 0)
      {
        creep.memory.targetID = droppedEnergy[Math.floor(Math.random() * droppedEnergy.length)].id;
        creep.memory.task = CONST.TASK_PICKUPENERGY;
        return;
      }
      else if (creep.carry.energy == 0)
      {
        if (util.getHomeRoom(creep)
          .energyAvailable != util.getHomeRoom(creep)
          .energyCapacityAvailable)
        {
          creep.memory.task = CONST.TASK_FILLFROMBASE;
          return;
        }
        var flag = Game.flags[creep.memory.homeRoom + "idle"];
        if (flag != undefined && flag != null)
        {
          creep.moveTo(flag,
          {
            reusePath: 10
          });
        }
      }
      else
      {

        creep.memory.targetID = -1;
        creep.memory.task = CONST.TASK_FILLBASE;
        return;
      }
    }

  }

};
module.exports = roleHauler;