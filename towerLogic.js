'use strict';
const CONST = require('CONSTANTS');
const cacheFind = require('cacheFind');
var util = require('util');


module.exports = {

  runTowers: function(towers)
  {
    if (towers == undefined || towers == null) return;
    if (towers.length > 0)
    {
      var closestHostile; // = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      var room = towers[0].room;
      var hostiles = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, room);

      /*
            let indexs = [];
            for (var i = 0; i < hostiles.length; ++i)
            {
              if (hostiles[i].owner.username == "Patrik")
              {
                var body = hostiles[i].body;
                if (!(body.includes(WORK) || body.includes(ATTACK) || body.includes(RANGED_ATTACK)))
                {
                  indexs.push(i);
                }
              }
            }
            for (var k = indexs.length - 1; k >= 0; --k)
            {
              hostiles.splice(indexs[k], 1);
            }*/

      if (hostiles.length == 0)
      {
        closestHostile = false;
      }
      else
      {
        var target = false;
        var i = 0;
        while (i < hostiles.length)
        {
          if (util.isDangerousCreep(hostiles[i]))
          {
            closestHostile = hostiles[i];
            target = true;
          }
          i = i + 1;

        }
      }
      if (!target) closestHostile = false;


      var damagedStructures = _.filter(cacheFind.findCached(CONST.CACHEFIND_DAMAGEDSTRUCTURES, room), (structure) => (structure.hits < 100000));
      var toRepair = damagedStructures[Math.floor(Math.random() * damagedStructures.length)];


      if (closestHostile)
      {
        for (var i = 0; i < towers.length; ++i)
        {
          if ((closestHostile.owner.username == "Invader"))
            towers[i].attack(closestHostile);
        }
        return;
      }

      if (toRepair)
      {
        for (var i = 0; i < towers.length; ++i)
        {
          if (towers[i].energyCapacity * 0.50 > towers[i].energy)
          {
            continue;
          }
          towers[i].repair(toRepair);
          if (!(toRepair.hits * 2 < toRepair.hitsMax))
          {
            return;
          }
        }
      }


    }
  }



}
