'use strict';

//terminals

//based on rcName

//globalTerminals [0000] = {id = id, isPowerLeveler = false, timeToNextUpdate}

let globalTerminals = {};

let sellMineralsTimer = 500;
let PRICES = {
  "H": 0.2,
  "O": 0.1,
  "U": 0.20,
  "L": 0.1,
  "K": 0.2
};

module.exports = {

  update: function(roomController, rcName)
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

      if (term != undefined)
      {
        let amount = term.store[RESOURCE_ENERGY];

        if (amount > 125000)
        {
          spareEnergy = spareEnergy + (amount - 25000) / 2;
        }
      }
      else
      {


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
    let activeOrderKeys = Object.keys(activeOrders);

    if (activeOrderKeys.length > 40)
    {
      for (let i = 0; i < activeOrderKeys.length; ++i)
      {
        if (!(activeOrders[activeOrderKeys[i]].active))
        {
          Game.market.cancelOrder(activeOrders[activeOrderKeys[i]].id);
        }
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
            let price = PRICES[storeKeys[j]];
            if (price == undefined) price = 0.2;

            let amount = Math.max(term.store[storeKeys[j]] / 2, 20000);
            console.log("MADE AN ORDER: " + storeKeys[j] + " " + price + " " + "20000" + " " + term.room.name);
            Game.market.createOrder(ORDER_SELL, storeKeys[j], price, amount, term.room.name);
          }
          else
          {
            Game.market.changeOrderPrice(activeOrder[0].id, activeOrder[0].price * 0.96);
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
      if (term == null || term == undefined) continue;
      if (termToFillIndex == -1)
      {
        if (Game.getObjectById(term.terminalID)
          .store[RESOURCE_ENERGY] == 0)
        {
          console.log("@!$!@$!@$!@$!@$@!$@!$");
          termToFillIndex = i;
        }
      }
      else if (termToFillFromIndex == -1 && i != termToFillIndex)
      {
        let terminalToCheck = Game.getObjectById(term.terminalID);
        if (terminalToCheck)
        {
          if (terminalToCheck.store[RESOURCE_ENERGY] > 125000)
          {
            console.log("@!$!@$!@$!@$!@$@!$@!$2222222");
            termToFillFromIndex = i;
          }
        }
      }
    }

    if (termToFillIndex != -1 && termToFillFromIndex != -1)
    {
      let termToFillFrom = Game.getObjectById(globalTerminals[terminalKeys[termToFillFromIndex]].terminalID);
      let termToFill = Game.getObjectById(globalTerminals[terminalKeys[termToFillIndex]].terminalID);

      let maxAmountToSend = 100000;
      let cost = Game.market.calcTransactionCost(maxAmountToSend, termToFillFrom.room.name, termToFill.room.name);
      cost = cost + 1; //make sure doesnt round down.
      console.log("COST: " + cost);
      let ratio = cost / maxAmountToSend;
      let amountToSend = Math.min(Math.floor(termToFillFrom.store[RESOURCE_ENERGY] / (1 + ratio)), maxAmountToSend);
      console.log("AMOUNTTOSEND: " + amountToSend);
      termToFillFrom.send(RESOURCE_ENERGY, amountToSend, termToFill.room.name);
      return true;
    }
  }
  //terminals = _.filter(Game.structures, filter: (structure) =>)

}
