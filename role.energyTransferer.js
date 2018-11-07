'use strict';
const CONST = require('CONSTANTS');
/*     EnergyTransferer - make from both supporting rooms. however, only have to go to/from one room?. Move terminal in supporting room to as close as possible.
                          have flag be RC-000x-P-W32E53 ? ugly. RC-000x-P-000x. but i dont have access to that in the rc func. maybe pass whole RC and reduce it asap?

      -fills from structure
      -fills structures in work room.
*/
//WORK ROOM IS ROOM made from
//HOME ROOM IS ROOM transfering to.

//NEEDS TERMINAL ID ASSIGNED AT CREATION. TO STRUCTURETODRAWFROM
var util = require('util');

var roleEnergyTransferer = {
  run: function(creep)
  {
    if (creep.carry.energy < creep.carryCapacity)
    {
      let term = creep.room.terminal;
      if (term)
      {
        if (term.store[RESOURCE_ENERGY] >= 100)
        {
          creep.memory.targetID = creep.room.terminal.id;
          creep.memory.fillResourceType = RESOURCE_ENERGY;
          creep.memory.task = CONST.TASK_FILLFROMTARGETSTRUCTURE;
          return;
        }
      }
      let stor = util.getHomeRoom(creep).storage;
      if (!stor) return;
      creep.memory.targetID = stor.id;
      creep.memory.fillResourceType = RESOURCE_ENERGY;
      creep.memory.task = CONST.TASK_FILLFROMTARGETSTRUCTURE;
      return;

    }
    else
    {
      creep.memory.targetID = -1;
      creep.memory.task = CONST.TASK_FILLBASE;
    }
  }


}

module.exports = roleEnergyTransferer;
