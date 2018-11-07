'use strict';

let gEdges = new Set();
let gPQ = [];
let gCurBaseSize = 1;
let gRoomTerrain;

function goClockWise(d)
{
  switch (d)
  {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
  }
}

function goCounterClockWise(d)
{
  switch (d)
  {
    case "N":
      return "W";
    case "E":
      return "N";
    case "S":
      return "E";
    case "W":
      return "S";
  }

}

function compare(e1, e2)
{
  return e2.sortVal - e1.sortVal;
}

function isUpDown(e)
{
  if (e.d == "N" || e.d == "S")
  {
    return true;
  }
  else // "E" || "W"
  {
    return false;
  }
}

function getOffset(e)
{
  if (e.d == "S" || e.d == "E")
  {
    return 1;
  }
  else // "N" || "W"
  {
    return -1;
  }
}

function countNeighbors(e)
{
  let count = 0;
  if (e.nMin != undefined) count++;
  if (e.nMax != undefined) count++;
  return count;
}

function areNeighborsMin(e)
{
  if (e.d == "N" || e.d == "W")
  {
    return true;
  }
  else // "S" || "E"
  {
    return false;
  }
}

function isSpotPassable(cur, otherDim, offset, bIsUpDown)
{
  if (bIsUpDown)
  {
    return isLocationPassable(cur, otherDim + offset);
  }
  else
  {
    return isLocationPassable(otherDim + offset, cur);
  }
}

function costToPush(e)
{
  let bIsUpDown = isUpDown(e);

  let offset = getOffset(e);

  let min;
  let max;
  let otherDim;
  if (bIsUpDown)
  {
    min = e.xMin;
    max = e.xMax;
    otherDim = e.yMin;
  }
  else
  {
    min = e.yMin;
    max = e.yMax;
    otherDim = e.xMin;
  }
  let cost = 0;
  for (let cur = min; cur <= max; ++cur)
  {
    let passable = isSpotPassable(cur, otherDim, offset, bIsUpDown);

    if (passable)
    {
      if (cur == min && e.nMin != undefined) cost++;
      if (cur == max && e.nMax != undefined) cost++;
      cost++;
    }
  }
  return cost;
}

function isLocationPassable(x, y)
{
  let ret = gRoomTerrain.get(x, y);
  if (ret == 0 /*Plain*/ || ret == TERRAIN_MASK_SWAMP)
  {
    return true;
  }
  if (ret == TERRAIN_MASK_WALL)
  {
    return false;
  }
}


function initEdgeSortVals(e)
{
  let p = costToPush(e) - e.s;
  let pVal = e.s - countNeighbors(e); //Number of base spaces you get pushing it out.
  e.sortVal = Math.min(p, p * (1.0 / pVal));
}

function initEdgeDimensions(dir, min, max, otherDim)
{
  let e = {};
  e.d = dir;
  let bIsUpDown = isUpDown(e);
  if (bIsUpDown)
  {
    e.xMin = min;
    e.xMax = max;
    e.yMin = otherDim;
    e.yMax = otherDim;
  }
  else //"E" || 'W'
  {
    e.xMin = otherDim;
    e.xMax = otherDim;
    e.yMin = min;
    e.yMax = max;
  }
  e.s = max - min + 1;

  if ((e.d == "N" && e.yMin > 2) || (e.d == "S" && e.yMin < 47) || (e.d == "E" && e.xMin < 47) || (e.d == "W" && e.xMin > 2))
  {
    e.canPush = true;
  }
  else
  {
    e.canPush = false;
  }
  return e;
}

function initEdgeNeighbors(e, minNeighbor, maxNeighbor)
{
  e.nMin = minNeighbor;
  e.nMax = maxNeighbor;
}

function increaseWidth(e, bMin)
{
  let bIsUpDown = isUpDown(e);
  e.s += 1;
  if (bIsUpDown && bMin)
  {
    e.xMin -= 1;
  }
  else if (bIsUpDown && !bMin)
  {
    e.xMax += 1;
  }
  else if (!bIsUpDown && bMin)
  {
    e.yMin -= 1;
  }
  else if (!bIsUpDown && !bMin)
  {
    e.yMax += 1;
  }
  initEdgeSortVals(e);

}

function updateEdgeNeighborsToNewEdge(e)
{
  let bNeighborAdjIsMin = areNeighborsMin(e);

  if (e.nMin != undefined)
  {
    if (bNeighborAdjIsMin) e.nMin.nMin = e;
    else e.nMin.nMax = e;

    increaseWidth(e.nMin, bNeighborAdjIsMin);
  }
  if (e.nMax != undefined)
  {
    if (bNeighborAdjIsMin) e.nMax.nMin = e;
    else e.nMax.nMax = e;

    increaseWidth(e.nMax, bNeighborAdjIsMin);
  }
}

function pushOutEdge(e)
{
  let offset = getOffset(e);
  let bIsUpDown = isUpDown(e);
  let bNeighborAdjIsMin = areNeighborsMin(e);

  let min;
  let max;
  let otherDim;
  if (bIsUpDown)
  {
    min = e.xMin;
    max = e.xMax;
    otherDim = e.yMin;
  }
  else
  {
    min = e.yMin;
    max = e.yMax;
    otherDim = e.xMin;
  }

  let startEdgePos;
  let makingEdge = false;

  for (let cur = min; cur <= max; ++cur)
  {
    let passable = isSpotPassable(cur, otherDim, offset, bIsUpDown);

    if (passable)
    {
      if (!makingEdge)
      {
        makingEdge = true;
        startEdgePos = cur;
      }
    }

    if (!passable || cur == max)
    {
      if (makingEdge)
      {
        let minNeighbor;
        let maxNeighbor;

        if (startEdgePos == min)
        {
          minNeighbor = e.nMin;
        }
        if (cur == max)
        {
          maxNeighbor = e.nMax;
        }

        let newE = initEdgeDimensions(e.d, startEdgePos, cur, otherDim + offset);
        initEdgeNeighbors(newE, minNeighbor, maxNeighbor);
        initEdgeSortVals(newE);
        updateEdgeNeighborsToNewEdge(newE);

        if (newE.canPush) gPQ.push(newE);
        Edges.add(newE);
        makingEdge = false;
      }
    }
  }
  Edges.remove(e);


}
module.exports = {

  planBaseWalls: function(roomName, xPos, yPos, minBaseSize)
  {
    gRoomTerrain = new Room.Terrain(roomName);
    gEdges = new Set();
    gPQ = [];
    gCurBaseSize = 1;
    //Initial setup
    let e1 = initEdgeDimensions("N", xPos, xPos, yPos);
    let e2 = initEdgeDimensions("E", yPos, yPos, xPos);
    let e3 = initEdgeDimensions("S", xPos, xPos, yPos);
    let e4 = initEdgeDimensions("W", yPos, yPos, xPos);

    //Initial setting of adjacent edges
    initEdgeNeighbors(e1, e4, e2);
    initEdgeNeighbors(e2, e1, e3);
    initEdgeNeighbors(e3, e4, e2);
    initEdgeNeighbors(e4, e1, e3);

    initEdgeSortVals(e1);
    initEdgeSortVals(e2);
    initEdgeSortVals(e3);
    initEdgeSortVals(e4);

    gEdges.add(e1);
    gEdges.add(e2);
    gEdges.add(e3);
    gEdges.add(e4);

    if (e1.canPush) gPQ.push(e1);
    if (e2.canPush) gPQ.push(e2);
    if (e3.canPush) gPQ.push(e3);
    if (e4.canPush) gPQ.push(e4);

    PQ.sort(compare);

    let e = PQ.pop();
    while (e != undefined)
    {
      if (e.sortVal > 0 && gCurBaseSize > minBaseSize)
      {
        return Edges;
      }
      pushOutEdge(e);
      PQ.sort(compare);
    }
  }

};
