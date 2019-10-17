
extract = function(game, fuelRate) {
    game.currFuelAmnt += fuelRate;
    game.totFuelAmnt += fuelRate;
    game.univFuelAmnt += fuelRate;
}

accelerate = function(game) {
    if (game.currFuelAmnt > 0) {
        game.clickMomentum++;
        game.currShipAccel += game.clickShipAccel-game.clickShipAccel*(game.clickMomentum/game.maxMomentum);
        game.shipSpeed += game.currShipAccel;
        game.currFuelAmnt--;
    }
}

autopilotShip = function(game, frame) {
    console.log(game.autopilot)
    if (game.currFuelAmnt > 0 && game.upgrades.autopilot.purchased && frame % (14-game.autopilot) == 0) {
        game.currFuelAmnt--;
        accelerate(game);
    }
}

moveShip = function(game) {
    if (game.clickMomentum > 0) { game.clickMomentum--; }
    game.currShipAccel *= game.SLOWDOWN;
    game.shipSpeed *= game.SLOWDOWN;
    game.distTraveled += game.shipSpeed/30;
}

buyWorker = function(game, workerIndex) {
    if (game.currFuelAmnt >= game.workers[workerIndex].price) {
        game.workers[workerIndex].numWorkers++;
        game.currFuelAmnt -= game.workers[workerIndex].price;
        game.fuelSpent += game.workers[workerIndex].price;
        game.workers[workerIndex].price = Math.floor(game.workers[workerIndex].price*1.1);
    }
}

buyAutopilot = function(game) {
    if (game.currFuelAmnt >= game.upgrades.autopilot.price && game.autopilot < 13) {
        game.currFuelAmnt -= game.upgrades.autopilot.price;
        game.fuelSpent += game.upgrades.autopilot.price;
        game.autopilot += game.upgrades.autopilot.val;
        game.upgrades.autopilot.price = Math.floor(game.upgrades.autopilot.price*1.5);
        game.upgrades.autopilot.purchased = true;
        console.log(10/game.autopilot)
    }
}

buyClickpowerShip = function(game) {
    if (game.currFuelAmnt >= game.upgrades.clickpower_ship.price && game.clickShipAccel < game.maxMomentum) {
        game.currFuelAmnt -= game.upgrades.clickpower_ship.price;
        game.fuelSpent += game.upgrades.clickpower_ship.price;
        game.clickShipAccel *= game.upgrades.clickpower_ship.val;
        game.upgrades.clickpower_ship.purchased = true;
    }
}

buyClickpowerPlanet = function(game) {
    if (game.currFuelAmnt >= game.upgrades.clickpower_planet.price) {
        game.currFuelAmnt -= game.upgrades.clickpower_planet.price;
        game.fuelSpent += game.upgrades.clickpower_planet.price;
        game.fuelRate *= game.upgrades.clickpower_planet.val;
        game.upgrades.clickpower_planet.purchased = true;
    }
}

buyWorkerEfficiency = function(game, workerIndex) {
    if (game.currFuelAmnt >= game.upgrades.workerEfficiencies[workerIndex].price) {
        game.currFuelAmnt -= game.upgrades.workerEfficiencies[workerIndex].price;
        game.fuelSpent += game.upgrades.workerEfficiencies[workerIndex].price;
        game.workers[workerIndex].fuelRate *= game.upgrades.workerEfficiencies[workerIndex].val;
        game.upgrades.workerEfficiencies[workerIndex].purchased = true;
    }
}

workWorker = function(game, worker, frame) {
    if (worker.numWorkers > 0 && frame % Math.floor((.95**worker.numWorkers)*40+2) == 0) {
        extract(game, worker.fuelRate);
        worker.clicked += worker.fuelRate;
    }
}