'use strict';
const CONST = require('CONSTANTS');

var util = require('util');
var cacheFind = require('cacheFind');


var taskKill = {
  run: function(creep)
  {
    let canHeal;
    if (creep.memory.hasHealParts != undefined)
    {
      canHeal = true;
    }
    else
    {
      canHeal = false;
    }
    if (creep.hits < creep.hitsMax && canHeal)
    {
      creep.heal(creep);
    }

    let hosttowers = cacheFind.findCached(CONST.CACHEFIND_HOSTILETOWERS, creep.room);
    if (hosttowers.length > 0)
    {
      if (creep.memory.patrolRoom != undefined)
      {
        if (creep.room.name != creep.memory.patrolRoom)
        {
          util.moveToRoom(creep, creep.memory.patrolRoom);
          return;
        }
      }
    }
    var target = Game.getObjectById(creep.memory.targetID);
    creep.memory.targetLastX = undefined;
    creep.memory.targetLastY = undefined;
    if (creep.memory.patrolRoom != undefined)
    {
      creep.memory.workRoom = creep.memory.patrolRoom;
    }
    if ((target == undefined || target == null || target.pos.roomName != creep.room.name) && creep.memory.patrolRoom != undefined)
    {
      let hostiles2 = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, Game.rooms[creep.room.name]);
      if (hostiles2.length == 0)
      {
        creep.memory.task = creep.memory.role;
        if (creep.room.name == creep.memory.patrolRoom)
        {
          util.moveOffEdge(creep);
        }
        return;
      }
      creep.memory.targetID = hostiles2[0].id;
      target = hostiles2[0];
    }
    else if (creep.room.name != creep.memory.workRoom && (target == undefined || target == null || creep.memory.patrolRoom == undefined))
    {
      //  if (creep.memory.targetLastX != undefined)
      //  {
      //util.moveToRoom(creep, creep.memory.workRoom, creep.memory.targetLastX, creep.memory.targetLastY, 0);
      //  }
      //  else
      //  {
      util.moveToRoom(creep, creep.memory.workRoom);
      //  }
      return;
    }

    //if (target.room.name != creep.memory.workRoom)
    //  {
    //    creep.memory.workRoom = target.room.name;
    //  }
    //  creep.memory.targetLastX = target.pos.x;
    //  creep.memory.targetLastY = target.pos.y;

    //attack closest target.
    let hostiles = cacheFind.findCached(CONST.CACHEFIND_HOSTILECREEPS, Game.rooms[creep.room.name]);
    let closest = -1;
    let closestRange = 1000;
    for (let i = 0; i < hostiles.length; ++i)
    {
      let range = creep.pos.getRangeTo(hostiles[i]);
      if (range <= closestRange)
      {
        if (range == closestRange)
        {
          if (Math.random() < 0.42)
          {
            closestRange = range;
            closest = i;
          }
        }
        else
        {
          closestRange = range;
          closest = i;
        }
      }
    }
    if (closest != -1)
    {
      creep.memory.targetID = hostiles[closest].id;
      target = hostiles[closest];
    }
    let range = creep.pos.getRangeTo(target);

    if (range == 1) creep.rangedMassAttack();
    else creep.rangedAttack(target);

    if (!canHeal) creep.attack(target);
    if (target == undefined)
    {
      creep.memory.task = creep.memory.role;
      return;
    }
    if (creep.pos.isNearTo(target.pos))
    {
      var towers = cacheFind.findCached(CONST.CACHEFIND_MYTOWERS, Game.rooms[creep.room.name]);
      //console.log(towers.length);
      for (var i = 0; i < towers.length; ++i)
      {
        towers[i].attack(target);
        //console.log("SUPPORTING FIRE");
      }
      creep.move(creep.pos.getDirectionTo(target.pos));
    }
    else if (creep.room.name == target.pos.roomName)
    {
      util.moveToNonWalkable(creep, target, 3);
    }

    if (!canHeal)
      creep.attack(target);
    //console.log("HERE");
    //console.log(range);
    let shouldKite = false;
    //if (creep.memory.alwaysKite) shouldKite = true;

    if (range <= 3 && shouldKite == false)
    {
      shouldKite = util.shouldKite(target);
      console.log(shouldKite);

    }
    if (range <= 3 && canHeal)
    {
      creep.heal(creep);
    }
    if (shouldKite)
    {
      if (range == 3)
      {
        creep.cancelOrder('move');
        //console.log("WE ARE GOING TO STAND STILL");
        var towers = cacheFind.findCached(CONST.CACHEFIND_MYTOWERS, Game.rooms[creep.room.name]);
        for (var i = 0; i < towers.length; ++i)
        {
          towers[i].attack(target);
          console.log("SUPPORTING FIRE");
        }
      }
      if (range == 2 || range == 1)
      {
        //console.log("WE ARE GOING TO TRY TO KITE");
        let ret = PathFinder.search(creep.pos,
        {
          pos: target.pos,
          range: 3
        },
        {
          flee: true
        });
        let pos = ret.path[0];
        //console.log(creep.pos.getDirectionTo(pos));
        creep.move(creep.pos.getDirectionTo(pos));
      }

    }


  }
}
module.exports = taskKill;
