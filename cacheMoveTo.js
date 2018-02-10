var utilMovement = require('util.movement');

var cacheMoveToM = new Map();

var cacheCostMatrix = new Map();



function calcCostMatrix(roomName)
{
  if (cacheCostMatrix.has(roomName))
  {
    return cacheCostMatrix.get(roomName);
  }
  var costMatrix = new PathFinder.CostMatrix;

  var room = Game.rooms[roomName];
  if (room == undefined || room == null)
  {
    return;
  }
  // Avoid creeps in the room
  room.find(FIND_CREEPS)
    .forEach(function (creep)
    {
      costMatrix.set(creep.pos.x, creep.pos.y, 0xff);
    });

  room.find(FIND_STRUCTURES)
    .forEach(function (struct)
    {
      if (struct.structureType === STRUCTURE_ROAD)
      {
        // Favor roads over plain tiles
        costMatrix.set(struct.pos.x, struct.pos.y, 1);
      }
      else if (struct.structureType !== STRUCTURE_CONTAINER &&
        (struct.structureType !== STRUCTURE_RAMPART ||
          !struct.my))
      {
        // Can't walk through non-walkable buildings
        costMatrix.set(struct.pos.x, struct.pos.y, 0xff);
      }
    });


  cacheCostMatrix.set(roomName, costMatrix);
  return costMatrix;
}



function myDirPathDeserialize(serializedPath)
{
  var ret = [];

  for (var i = 0; i < serializedPath.length; ++i)
  {
    ret.push(parseInt(serializedPath[i]));
  }
  return ret;
}

function myDirPathSerialize(deserializedPath)
{
  var ret = "";
  for (var i = 0; i < deserializedPath.length; ++i)
  {
    ret = ret + "" + deserializedPath[i];
  }
  return ret;
}

function myPathConvertToDirections(path, creep)
{
  var lastX = creep.pos.x;
  var lastY = creep.pos.y;
  var nextX;
  var nextY;

  var directionPath = [];

  for (var i = 0; i < path.length; ++i)
  {

    nextX = path[i].x;
    nextY = path[i].y;

    var dX = nextX - lastX;
    var dY = nextY - lastY;

    var dir = -1;

    //room transition code
    if (dX > 1)
    {
      dX = -1;
    }
    else if (dX < -1)
    {
      dX = 1;
    }
    else if (dY > 1)
    {
      dY = -1;
    }
    else if (dY < -1)
    {
      dY = 1;
    }

    var rawDir = (dX + 1) + (3 * (dY + 2));

    switch (rawDir)
    {
    case 3:
      dir = TOP_LEFT;
      break;
    case 6:
      dir = LEFT;
      break;
    case 9:
      dir = BOTTOM_LEFT;
      break;
    case 4:
      dir = TOP;
      break;
    case 10:
      dir = BOTTOM;
      break;
    case 5:
      dir = TOP_RIGHT;
      break;
    case 8:
      dir = RIGHT;
      break;
    case 11:
      dir = BOTTOM_RIGHT;
      break;
    }
    directionPath.push(dir);
    lastX = nextX;
    lastY = nextY;
  }
  return directionPath;
}



function cacheLookupPath(creep, to, forceNew)
{

  var key = creep.room.name + " " + creep.pos.x + " " + creep.pos.y + " " + to.room.name + " " + to.pos.x + " " + to.pos.y;

  var pathFindingTarget = creep.memory.CPF_targetID;
  var newTarget = to.room.name + " " + to.pos.x + " " + to.pos.y;

  var rand = Math.floor(Math.random() * 128);
  if (cacheMoveToM.has(key) && rand > 10 && !forceNew && pathFindingTarget == newTarget)
  {
    console.log("USED A SAVED PATH");
    return myDirPathDeserialize(cacheMoveToM.get(key));
  }
  else
  {
    //console.log(creep.pos.x + " " + creep.pos.y + " " + creep.room);
    //console.log(to.pos.x + " " + to.pos.y + " " + to.room);
    var ret = PathFinder.search(creep.pos,
    {
      pos: to.pos,
      range: 1
    },
    {
      maxCost: 3000,
      plainCost: 2,
      swampCost: 6,
      roomCallback: function (roomName)
      {
        return calcCostMatrix(roomName);
      }
    });

    if (ret.incomplete)
    {
      console.log("PATHFINDING ERROR. UNABLE TO FIND PATH FROM: " + creep.room + " " + creep.pos.x + " " + creep.pos.y + " " + " TO " + to.room + " " + to.pos.x + " " + to.pos.y);
    }
    /*  for (var i = 0; i < ret.path.length; ++i)
      {
        console.log(ret.path[i].x + " " + ret.path[i].y);
      }*/

    var path = myPathConvertToDirections(ret.path, creep);

    /*  for (var i = 0; i < path.length; ++i)
      {
        console.log(path[i]);
      }*/

    cacheMoveToM.set(key, myDirPathSerialize(path));

    creep.memory.CPF_targetID = newTarget;

    console.log("CALCD A PATH");

    return path;

  }

}

module.exports = {

  cacheMoveTo: function (creep, to)
  {
    if (creep.fatigue > 0)
    {
      return ERR_TIRED;
    }
    var lastXPos = creep.memory.CPF_lastXPos;
    var lastYPos = creep.memory.CPF_lastYPos;
    var curXPos = creep.pos.x;
    var curYPos = creep.pos.y;

    //fallback, need to have room in site.
    if (to.room == undefined || to.room == null)
    {
      return creep.moveTo(to,
      {
        reusePath: 50
      });
    }

    if (Math.abs(creep.pos.x - to.pos.x) <= 1 && Math.abs(creep.pos.y - to.pos.y) <= 1 && creep.room.name == to.room.name)
    {
      console.log("ALREADY THERE");
      return 0;
    }

    //console.log("STARTING PF CODE");

    var savedPath;
    var savedPathStep = creep.memory.CPF_mySavedPathStep;
    var path = [];

    if (savedPathStep == -1 || savedPathStep == null || savedPathStep == undefined)
    {
      path = cacheLookupPath(creep, to, false);
      if (path.length == 0)
      {
        creep.memory.CPF_lastXPos = -1;
        creep.memory.CPF_lastYPos = -1;
        return;
      }
      //console.log(myDirPathSerialize(path));
      savedPath = path;
      creep.memory.CPF_mySavedPath = myDirPathSerialize(path);
      savedPathStep = 0;

    }
    else
    {
      path = myDirPathDeserialize(creep.memory.CPF_mySavedPath);
    }


    if (lastXPos == curXPos && lastYPos == curYPos && savedPathStep != -1)
    {

      let rand = Math.floor(Math.random() * 8);
      let rand2 = Math.floor(Math.random() * 100);
      if (rand2 > 60)
      {
        console.log("antistuck");
        let key = creep.room.name + " " + creep.pos.x + " " + creep.pos.y + " " + to.room.name + " " + to.pos.x + " " + to.pos.y;

        //cacheMoveToM.delete(key);

        savedPath = path;
        creep.memory.CPF_mySavedPath = [];
        creep.memory.CPF_mySavedPathStep = -1;
        creep.move(rand + 1);
        creep.memory.CPF_lastXPos = -1;
        creep.memory.CPF_lastYPos = -1;
        return ERR_NO_PATH;
      }
      else
      {
        return ERR_NO_PATH;
      }
    }

    if (savedPathStep > path.length)
    {
      creep.memory.CPF_mySavedPathStep = -1;
      creep.memory.CPF_mySavedPath = undefined;
      creep.memory.CPF_lastXPos = -1;
      creep.memory.CPF_lastYPos = -1;
      return 0;
    }

    if (path.length == 0)
    {
      return 0;
    }
    //console.log("MOVING " + creep.name + " " + path[savedPathStep] + " " + creep.room);
    var res = creep.move(path[savedPathStep]);
    creep.memory.CPF_lastXPos = curXPos;
    creep.memory.CPF_lastYPos = curYPos;

    creep.memory.CPF_mySavedPathStep = savedPathStep + 1;

    //console.log("ENDING PF CODE");
    //console.log("TIME: " + (end - start));
    return res;


  },

  cacheMoveToClear: function ()
  {
    cacheMoveToM = new Map();
    Memory.CPF_cacheMoveToMSize = 0;
    Memory.CPF_cacheMoveToM = undefined;

  },
  cacheMoveToSave: function ()
  {
    if (cacheMoveToM.size > 0)
    {
      Memory.CPF_cacheMoveToMSize = cacheMoveToM.size;
      Memory.CPF_cacheMoveToM = JSON.stringify([...cacheMoveToM]);
    }


  },
  cacheMoveToLoad: function ()
  {

    if (Memory.CPF_cacheMoveToM != undefined)
    {
      var temp = JSON.parse(Memory.CPF_cacheMoveToM);
      var tempArr = temp.toString()
        .split(',');
      var arrSize = Memory.CPF_cacheMoveToMSize;
      cacheMoveToM = new Map();
      for (var i = 0; i < arrSize * 2; i = i + 2)
      {
        cacheMoveToM.set(tempArr[i], tempArr[i + 1]);
      }
    }

    cacheCostMatrix = new Map();



  }



}