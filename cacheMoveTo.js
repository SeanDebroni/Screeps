var utilMovement = require('util.movement');

var cacheMoveToM = new Map();


var myDirPathDeserialize = function (serializedPath)
{
  var ret = [];

  for (var i = 0; i < serializedPath.length; ++i)
  {
    ret.push(parseInt(serializedPath[i]));
  }
  return ret;
}

var myDirPathSerialize = function (deserializedPath)
{
  var ret = "";
  for (var i = 0; i < deserializedPath.length; ++i)
  {
    ret = ret + "" + deserializedPath[i];
  }
  return ret;
}

myPathConvertToDirections(path, creep)
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

    var rawDir = dX + 3 * (dY);

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

}



cacheLookupPath: function (creep, to, forceNew)
{
  var key = creep.room.name + " " + creep.pos.x + " " + creep.pos.y + " " + to.room.name + " " + to.pos.x + " " + to.pos.y;

  var rand = Math.floor(Math.random() * 128);
  if (cacheMoveToM.has(key) && rand > 0.05 && !forceNew)
  {
    return myDirPathDeserialize(cacheMoveToM.get(key));
  }
  else
  {
    var ret = PathFinder.search(creep.pos,
    {
      pos: to.pos,
      range: 1
    },
    {
      maxCost: 1500
    });

    if (ret.incomplete)
    {
      console.log("PATHFINDING ERROR. UNABLE TO FIND PATH FROM: " + creep.pos.room + " " + creep.pos.x + " " + creep.pos.y + " " + " TO " + to.pos.room + " " + to.pos.x + " " + to.pos.y);
      return -1;
    }

    var path = myPathConvertToDirections(ret.path);

    cacheMoveToM.put(key, myDirPathSerialize(path));

    return path;

  }

}

module.exports = {

  cacheMoveTo: function (creep, to)
  {
    var start = new Date()
      .getTime();
    console.log("STARTING PF CODE");

    var savedPath;
    var savedPathStep = creep.memory.CPF_mySavedPathStep;
    var path = -1;

    if (savedPathStep == -1 || savedPathStep == null || savedPathStep == undefined)
    {
      path = cacheLookupPath(creep, to, false);
      if (path == -1)
      {
        return;
      }
      console.log(myDirPathSerialize(path));
      savedPath = path;
      creep.memory.CPF_mySavedPath = myDirPathSerialize(path);
      savedPathStep = 0;

    }
    else
    {
      path = myDirPathDeserialize(creep.memory.CPF_mySavedPath);
    }

    var lastXPos = creep.memory.CPF_lastXPos;
    var lastYPos = creep.memory.CPF_lastYPos;
    var curXPos = creep.pos.x;
    var curYPos = creep.pos.y;
    if (lastXPos == creep.pos.x && lastYPos = creep.memory.CPF_lastYPos)
    {
      path = cacheLookupPath(creep, to, true);
      if (path == -1)
      {
        return;
      }
      savedPath = path;
      creep.memory.CPF_mySavedPath = myDirPathSerialize(path);
      savedPathStep = 0;
    }

    if (savedPathStep > path.length)
    {
      creep.memory.CPF_mySavedPathStep = -1;
      creep.memory.CPF_mySavedPath = undefined;
      return -1;
    }

    var res = creep.move(path[savedPathStep]);
    creep.memory.CPF_lastXPos = curXPos;
    creep.memory.CPF_lastYPos = curYPos;
    creep.memory.CPF_mySavedPathStep = savedPathStep + 1;



    var end = new Date()
      .getTime();
    console.log("ENDING PF CODE");
    console.log("TIME: " + end - start);
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



  }



}