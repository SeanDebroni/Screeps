const CONST = require('CONSTANTS');


module.exports = {

  runTower: function(tower)
  {
    if(tower)
    {
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax
      });

      if(closestHostile)
      {
          tower.attack(closestHostile);
      }
      if(closestDamagedStructure)
      {
          tower.repair(closestDamagedStructure);
      }


    }
  }



}
