setupGame = function(game, fuelTypes, workerInfo) {
    game.new = false;
    game.clickShipAccel = 5;
    game.maxMomentum = 100;
    game.fuelRate = 1;
    game.currFuelAmnt = 1000;
    game.fuelType = fuelTypes[0];
    var now = new Date();
    game.startTime = now.getTime();
    game.SLOWDOWN = .95;
    for (var x = 0; x < workerInfo.workerNames[0].length; x++) {
        game.workers[x].name = workerInfo.workerNames[0][x];
        game.workers[x].fuelRate = workerInfo.workerRates[0][x];
        game.workers[x].price = workerInfo.workerPrices[0][x];
        game.upgrades.workerEfficiencies[x].price = workerInfo.workerPrices[0][x]*3;
        game.upgrades.workerEfficiencies[x].val = 1.1;
    }
    game.upgrades.autopilot.val = 1;
    game.upgrades.autopilot.price = 400;
    game.upgrades.clickpower_ship.val = 1.1;
    game.upgrades.clickpower_ship.price = 1000;
    game.upgrades.clickpower_planet.val = 1.1;
    game.upgrades.clickpower_planet.price = 400;
    sendGameState(game);
}