const CONST = require('CONSTANTS');
var cacheMoveTo = require('cacheMoveTo');

//Create with memory s which is the id of the source to harvest
var roleHarvester = {
  run: function (creep)
  {
    var source = Game.getObjectById(creep.memory.sID);

    if (creep.harvest(source) != 0)
    {
      cacheMoveTo.cacheMoveTo(creep, source);
      /*creep.moveTo(source,
      {
        reusePath: 5
      });*/
    }
    else
    {
      creep.memory.task = CONST.TASK_MINEENERGY;
    }
  }
};
module.exports = roleHarvester;