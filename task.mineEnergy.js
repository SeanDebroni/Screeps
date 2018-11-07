'use strict';
var taskMineEnergy = {
  run: function(creep)
  {
    let rand = Math.random();
    let havntTriedRepair = true;
    if (rand < 0.1)
    {
      if (creep.memory.isHarvesterContainer)
      {
        if (creep.carry[RESOURCE_ENERGY] >= 6)
        {
          let container = creep.pos.lookFor(LOOK_STRUCTURES);
          for (var i = 0; i < container.length; ++i)
          {
            if (container[i].hitsMax - container[i].hits >= 125000)
            {
              creep.repair(container[i]);
              return;
            }
          }
        }
      }
      havntTriedRepair = false;
    }

    var source = Game.getObjectById(creep.memory.sID);
    var err = creep.harvest(source);
    if (!havntTriedRepair) return;
    if (err == ERR_NOT_ENOUGH_RESOURCES)
    {
      if (creep.memory.isHarvesterContainer)
      {
        if (creep.carry[RESOURCE_ENERGY] >= 6)
        {
          let container = creep.pos.lookFor(LOOK_STRUCTURES);
          for (var i = 0; i < container.length; ++i)
          {
            if (container[i].hitsMax - container[i].hits >= 600)
            {
              creep.repair(container[i]);
              return;
            }
          }
        }
        else
        {
          let container = creep.pos.lookFor(LOOK_STRUCTURES);
          for (var i = 0; i < container.length; ++i)
          {
            if (container[i].structureType == STRUCTURE_CONTAINER)
            {
              creep.withdraw(container[i], RESOURCE_ENERGY);
              if (container[i].hitsMax - container[i].hits >= 600)
              {
                creep.repair(container[i]);
              }
              return;
            }
          }

        }
      }
    }
    else if (err != 0)
    {
      creep.memory.task = creep.memory.role;
    }
  }
}
module.exports = taskMineEnergy;
