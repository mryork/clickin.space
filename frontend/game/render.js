renderShipStats = function(game, div) {
    div.html("");
    div.append("<p>Speed: "+Math.floor(game.shipSpeed)+"</p>")
    div.append("<p>Distance: "+Math.floor(game.distTraveled)+"</p>");
    div.append("<p>Fuel: "+game.currFuelAmnt+"</p>");
}

renderWorkerStats = function(game, div) {
    div.html("");
    for (var i = 0; i < game.workers.length; i++) {
        div.append("<p>Name: "+game.workers[i].name+"</p>");
        div.append("<p>Num: "+game.workers[i].numWorkers+"</p>");
        div.append("<p>Price: "+game.workers[i].price+"</p>");
        div.append("<p>Fuel Produced: "+game.workers[i].clicked+"</p>");
    }
}