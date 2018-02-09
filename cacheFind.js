const CONST = require('CONSTANTS');

var cache = new Map();


module.exports = {

  findCached: function (whatToFind, room)
  {
    if (room == null || room == undefined)
    {
      return [];
    }

    var key = whatToFind + " " + room.name;
    if (cache.has(key))
    {
      return cache.get(key);
    }

    switch (whatToFind)
    {
    case CONST.CACHEFIND_DAMAGEDSTRUCTURES:

      /*var max = CONST.VAL_MAXSTRUCTUREHITS;
      var a = [];
      while(a.length ==0)
      {
        a = (room.find(FIND_STRUCTURES, {
          filter: (structure) =>
          {
              return (structure.hits < structure.hitsMax && structure.hits < max);
          }
        }));
        max = max*2;
      }*/

      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.hits < structure.hitsMax && structure.hits < CONST.VAL_MAXSTRUCTUREHITS);
        }
      }));


      //console.log(room.name + " has " + a.length + " damaged structures.");
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_WALLS:
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_WALL);
        }
      }));
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_HOSTILEBUILDINGS:
      var a = (room.find(FIND_HOSTILE_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType != STRUCTURE_CONTROLLER);
        }
      }));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_HOSTILECREEPS:
      var a = (room.find(FIND_HOSTILE_CREEPS));
      cache.set(key, a);
      break;

    case CONST.CACHEFIND_MYTOWERS:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_TOWER);
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_SOURCES:
      /*var s = [];
      for(var room_name in Game.rooms)
      {
          s= s.concat(Game.rooms[room_name].find(FIND_SOURCES));
      }*/
      s = room.find(FIND_SOURCES);
      cache.set(key, s);
      break;
    case CONST.CACHEFIND_DROPPEDENERGY:
      var d = [];
      /*
      for(var room_name in Game.rooms) {
          d= d.concat(Game.rooms[room_name].find(FIND_DROPPED_RESOURCES));
      }*/
      var d = (room.find(FIND_DROPPED_RESOURCES,
      {
        filter: (resource) =>
        {
          return (resource.resourceType == RESOURCE_ENERGY && resource.amount > 5);
        }
      }));
      cache.set(key, d);
      break;
    case CONST.CACHEFIND_CONTAINERSTOFILL:
      var a = (room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity);
        }
      }));

      cache.set(key, a);
      break;
    case CONST.CACHEFIND_CONSTRUCTIONSITES:
      cache.set(key, room.find(FIND_CONSTRUCTION_SITES,
      {
        filter: (site) =>
        {
          return (site.my);
        }
      }));
      break;
    case CONST.CACHEFIND_STRUCTURESTOFILL:

      var a = (room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && (structure.energy < structure.energyCapacity);
        }
      }));

      cache.set(key, a);
      break;
    case CONST.CACHEFIND_TOWERSTOFILL:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < 0.6 * structure.energyCapacity);
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_CONTAINERSWITHENERGY:
      var a = room.find(FIND_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] >= 50;
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_STRUCTURESWITHENERGY:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return ((structure.structureType == STRUCTURE_EXTENSION) || (structure.structureType == STRUCTURE_SPAWN)) && structure.energy >= 50;
        }
      });
      cache.set(key, a);
      break;
    case CONST.CACHEFIND_SPAWNS:
      var a = room.find(FIND_MY_STRUCTURES,
      {
        filter: (structure) =>
        {
          return (structure.structureType == STRUCTURE_SPAWN)
        }
      });
      cache.set(key, a);
      break;
    default:
      console.log("TRYING TO FIND SOMETHING UNSUPPROTED");
      return;
    }
    return cache.get(key);


  },
  cacheFindClear: function ()
  {
    cache = new Map();
  }




};