
const worker = {
    name: "",
    numWorkers: 0,
    fuelRate: 0,
    price: 0,
    clicked: 0
}

const upgrade = {
    val: 0,
    price: 0,
    purchased: false
}

var gameState = {
    new: true,
    shipSpeed: 0,
    clickMomentum: 0,
    clickShipAccel: 0,
    currShipAccel: 0,
    maxMomentum: 0,
    fuelType: "",
    fuelRate: 0,
    currFuelAmnt: 0,
    totFuelAmnt: 0,
    univFuelAmnt: 0,
    fuelSpent: 0,
    distTraveled: 0,
    startTime: 0,
    SLOWDOWN: 0,
    workers: [Object.assign({}, worker), Object.assign({}, worker), Object.assign({}, worker)],
    upgrades: {
        autopilot: Object.assign({}, upgrade),
        clickpower_ship: Object.assign({}, upgrade),
        clickpower_planet: Object.assign({}, upgrade),
        workerEfficiencies: [Object.assign({}, upgrade),Object.assign({}, upgrade),Object.assign({}, upgrade)]
    },
    autopilot: 0
}

var fuelTypes = [ "gasoline", "uranium", "deuterium", "crystal" ]
var workerInfo  = {
    workerNames: [
        ["miners", "refiners", "extractors"],
        [  ],
        [  ],
        [  ]
    ],
    workerRates: [ [1, 4, 12],
                    [  ],
                    [  ],
                    [  ]
    ],
    workerPrices: [
        [10, 300, 6000],
        [  ],
        [  ],
        [  ]
    ]
}

class Game {
    constructor(userGame) {
        this.gameState = userGame;
        if (userGame == undefined) {
            this.gameState = gameState;
        } else {
		    this.gameState = userGame;
	    }
        if (this.gameState.new) {
            setupGame(this.gameState, fuelTypes, workerInfo);
        }
    }
}

var mainGame = async function() {
    getGameState().then((gameStated) => {
    if(gameStated.new) {
	window.location.reload(false);
    }
    const game = new Game(gameStated);
    var frame = 0;
    var fuel = 0;
    var now = Date.now();

    var ship = $("#root .ship");
    var planet = $("#root .planet");
    var miner = $("#root .miner");
    var refiner = $("#root .refiner");
    var extractor = $("#root .extractor");
    var autopilot = $("#root .upAuto");
    var clickpowerShip = $("#root .upCPship");
    var clickpowerPlanet = $("#root .upCPplanet");
    var signOut = $("#root .signOut");

    setInterval(() => {
        console.log(game.gameState);
        document.getElementById("minerValue").innerHTML = game.gameState.workers[0].numWorkers;
        document.getElementById("refinerValue").innerHTML = game.gameState.workers[1].numWorkers;
        document.getElementById("extractorValue").innerHTML = game.gameState.workers[2].numWorkers;
        document.getElementById("upCPshipVal").innerHTML = game.gameState.upgrades.clickpower_ship.val;
        document.getElementById("upCPplanetVal").innerHTML = game.gameState.upgrades.clickpower_planet.val;
        document.getElementById("upAutoVal").innerHTML = game.gameState.upgrades.autopilot.val;
        document.getElementById("fuelamount").innerHTML = String(game.gameState.currFuelAmnt);
    }, 100);

    miner.on("click", function(event) {
        console.log("clicked miner");
        buyWorker(game.gameState, 0);
    });
    refiner.on("click", function(event) {
        buyWorker(game.gameState, 1);
    });
    extractor.on("click", function(event) {
        buyWorker(game.gameState, 2);
    });
    ship.on("click", function(event) {
        accelerate(game.gameState);
        // console.log(game.gameState)
    });
    planet.on("click", function(event) {
        extract(game.gameState, game.gameState.fuelRate);
    });

    autopilot.on("click", function(event) {
        buyAutopilot(game.gameState);
    });

    clickpowerShip.on("click", function(event) {
        buyClickpowerShip(game.gameState);
    })

    clickpowerPlanet.on("click", function(event) {
        buyClickpowerPlanet(game.gameState);
    })

    signOut.on("click", function(event) {
        exitGame(game.gameState);
	window.location.reload(false);
    });

    setInterval(() => {
        frame++;
        autopilotShip(game.gameState, frame);
        moveShip(game.gameState);
        renderShipStats(game.gameState, $('#root .shipStats'));
        renderWorkerStats(game.gameState, $('#root .workerStats'));
        // console.log(game.gameState.workers)
        for (var i = 0; i < game.gameState.workers.length; i++) {
            workWorker(game.gameState, game.gameState.workers[i], frame);
        }
        // $("#root .frame").html("");
        // $("#root .frame").append("<p>"+frame+"</p>");
        // $("#root .frame").append("<p>Fuel Spent: "+game.gameState.fuelSpent+"</p>");
        $("#root #distance").html(Math.floor(game.gameState.distTraveled));
        if (game.gameState.currFuelAmnt > fuel) {
            var now2 = Date.now();
            now2 -= now;
            // console.log(now2/(game.gameState.currFuelAmnt-fuel))
            now = Date.now();
        }
        fuel = game.gameState.currFuelAmnt;
    }, 33);

    setInterval(() => {
        sendGameState(game.gameState);
    }, 30000);
	});
}

setGameLogin(mainGame);
