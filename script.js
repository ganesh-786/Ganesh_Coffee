/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  setInterval(() => {
    data.coffee++;
    updateCoffeeView(data.coffee);
    renderProducers(data);
  }, 200);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach((producer) => {
    if (!producer.unlocked && coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter((producer) => producer.unlocked);
}

function makeDisplayNameFromId(id) {
  // your code here
  return id
    .split("_")
    .map((word) => {
      if (word.length === 0) return;
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // Keep removing the first child until none remain
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // 1) Unlock based on current coffee:
  unlockProducers(data.producers, data.coffee);

  // 2) Clear out old DOM
  const container = document.getElementById("producer_container");
  deleteAllChildNodes(container);

  // 3) Grab only the unlocked producers
  const unlocked = getUnlockedProducers(data);

  // 4) For each, build a div and append
  unlocked.forEach((producer) => {
    const div = makeProducerDiv(producer);
    container.appendChild(div);
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // Find the object in data.producers whose id matches
  return data.producers.find((p) => p.id === producerId);
}

function canAffordProducer(data, producerId) {
  const prod = getProducerById(data, producerId);
  return data.coffee >= prod.price;
}

function updateCPSView(cps) {
  document.getElementById("cps").innerText = cps;
}

function updatePrice(oldPrice) {
  // Multiply by 1.25 and round down
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // 1) Can we afford it?
  if (!canAffordProducer(data, producerId)) return false;

  // 2) Mutate data: subtract cost, increment qty, add CPS, bump price
  const prod = getProducerById(data, producerId);
  data.coffee -= prod.price;
  prod.qty++;
  data.totalCPS += prod.cps;
  prod.price = updatePrice(prod.price);

  return true;
}
function buyButtonClick(event, data) {
  // Only respond to button clicks
  if (event.target.tagName !== "BUTTON") return;

  const producerId = event.target.id.replace("buy_", "");
  const success = attemptToBuyProducer(data, producerId);

  if (!success) {
    // make sure to hit the test’s spy on window.alert
    window.alert("Not enough coffee!");
    return;
  }

  // Re‑render everything that changed
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  renderProducers(data);
}

function tick(data) {
  // 1) Add total CPS to coffee
  data.coffee += data.totalCPS;

  // 2) Update the coffee counter in the DOM
  updateCoffeeView(data.coffee);

  // 3) Possibly unlock & render new producers
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
