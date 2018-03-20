'use strict';

//terminals

//based on rcName

//globalTerminals [0000] = {id = id, isPowerLeveler = false, timeToNextUpdate}

let globalTerminals = {};

let sellMineralsTimer = 500;
let PRICES = {
  "H": 0.325,
  "O": 0.075,
  "U": 0.25,
  "L": 0.21,
  "K": 0.26
};

module.exports = {

  update: function (roomController, rcName)
  {
    if (globalTerminals[rcName] != undefined && globalTerminals[rcName].timeToNextUpdate > 0)
    {
      globalTerminals[rcName].timeToNextUpdate = globalTerminals[rcName].timeToNextUpdate - 1;
      return;
    }
    let newRecord;

    if (globalTerminals[rcName] == undefined)
    {
      newRecord = {
        timeToNextUpdate: 100,
        isPowerLeveler: false
      };
    }
    else
    {
      newRecord = globalTerminals[rcName];
      newRecord.isPowerLeveler = false;
      newRecord.timeToNextUpdate = 100;
    }

    let rooms = Object.keys(roomController);
    for (let i = 0; i < rooms.length; ++i)
    {
      let roomName = rooms[i];
      let absRoomName = roomController[roomName];
      let room = Game.rooms[absRoomName];

      let roomType = roomName.charAt(0);
      if (roomType == "M")
      {
        if (!room)
        {
          return;
        }
        if (room.terminal == undefined || room.terminal == null)
        {
          return;
        }
        newRecord.terminalID = room.terminal.id;
      }
      if (roomType == "P")
      {
        newRecord.isPowerLeveler = true;
      }

    }
    if (newRecord.terminalID != undefined)
    {
      globalTerminals[rcName] = newRecord;
    }
    else
    {
      globalTerminals[rcName] = undefined;
    }

  },
  getSpareEnergy()
  {
    let terminalKeys = Object.keys(globalTerminals);
    let spareEnergy = 0;

    for (let i = 0; i < terminalKeys.length; ++i)
    {
      let term = Game.getObjectById(globalTerminals[terminalKeys[i]].terminalID);
      let amount = term.store[RESOURCE_ENERGY];

      if (amount > 100000)
      {
        spareEnergy = spareEnergy + (amount - 100000);
      }
    }
    return spareEnergy;


  },
  doSellMinerals()
  {
    if (sellMineralsTimer > 0)
    {
      sellMineralsTimer = sellMineralsTimer - 1;
      return;
    }
    sellMineralsTimer = 1000;
    let activeOrders = Game.market.orders;

    if (activeOrders.length > 50)
    {
      let inactiveOrders = _.filter(activeOrders, (order) => !order.isActive);

      for (let i = 0; i < inactiveOrders.length; ++i)
      {
        Game.market.cancelOrder(inactiveOrders[i].id);
      }
    }

    let terminalKeys = Object.keys(globalTerminals);
    for (let i = 0; i < terminalKeys.length; ++i)
    {
      let term = Game.getObjectById(globalTerminals[terminalKeys[i]].terminalID);
      let activeOrder = _.filter(activeOrders, (order) => order.roomName == term.room.name);

      let storeKeys = _.filter(Object.keys(term.store), (type) => type != RESOURCE_ENERGY);

      for (let j = 0; j < storeKeys.length; ++j)
      {
        if (term.store[storeKeys[j]] > 20000)
        {
          let activeOrder = _.filter(activeOrders, (order) => order.roomName == term.room.name && order.active);
          if (activeOrder.length == 0)
          {
            let amount = Math.max(term.store[storeKeys[j]] / 2, 20000);
            console.log("MADE AN ORDER: " + storeKeys[j] + " " + PRICES[storeKeys[j]] + " " + "20000" + " " + term.room.name);
            Game.market.createOrder(ORDER_SELL, storeKeys[j], PRICES[storeKeys[j]], amount, term.room.name);
          }
          else
          {
            Game.market.changeOrderPrice(activeOrder[0].id, activeOrder[0].price * 0.99);
          }
        }
      }
    }


  },

  doPowerLevelEnergyBalance()
  {
    let terminalKeys = Object.keys(globalTerminals);
    //find a power leveling one that needs energy
    let termToFillIndex = -1;
    let termToFillFromIndex = -1;
    for (let i = 0; i < terminalKeys.length; ++i)
    {
      let term = globalTerminals[terminalKeys[i]];
      if (term.isPowerLeveler && termToFillIndex == -1)
      {
        if (Game.getObjectById(term.terminalID)
          .store[RESOURCE_ENERGY] < 50000)
        {
          termToFillIndex = i;
        }
      }
      else if (!term.isPowerLeveler && termToFillFromIndex == -1)
      {
        if (Game.getObjectById(term.terminalID)
          .store[RESOURCE_ENERGY] > 125000)
        {
          termToFillFromIndex = i;
        }
      }
    }

    if (termToFillIndex != -1 && termToFillFromIndex != -1)
    {
      let termToFillFrom = globalTerminals[terminalKeys[termToFillFromIndex]];
      let termToFill = globalTerminals[terminalKeys[termToFillIndex]];
      Game.getObjectById(termToFillFrom.terminalID)
        .send(RESOURCE_ENERGY, 100000, Game.getObjectById(termToFill.terminalID)
          .room.name);
      return true;
    }
  }
  //terminals = _.filter(Game.structures, filter: (structure) =>)

}