'use strict';


//Creep name -> object
//Object.roomPath = array of room names;
//
let longDistanceCache = {};
module.exports = {

  longDistanceMoveToRoom(creep, targetRoomName)
  {

    //Find path of rooms from source to dest
    let route = Game.map.findRoute(startPos.roomName, targetRoomName);

    //Move one room at a time.

    //


  }

};
