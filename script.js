const originalInventory = [
  { name: "Beetle-Boo", equipped: false, draggable: false },
  { name: "Dirty Loin Cloth", equipped: true, draggable: true }
];

const itemData = {
  "Beetle-Boo": {
    emoji: "🧸",
    draggable: false,
    equippable: false,
    firesafe: true,
    description: "A soot-covered plush beetle. One eye melted."
  },
  "Dirty Loin Cloth": {
    emoji: "🩲",
    draggable: true,
    equippable: true,
    firesafe: false,
    description: "Grimy, ash-caked, and riding low."
  },
  "Full Loin Cloth": {
    emoji: "🩲💩",
    draggable: true,
    equippable: true,
    firesafe: false,
    description: "You sphinctersense is tingling."
  },
  "Bone Dagger": {
    emoji: "🦴",
    draggable: false,
    equippable: true,
    firesafe: false,
    description: "A jagged piece of survival. Notched but sharp enough."
  }
};

const nameInput = document.getElementById("name-input");
const nameDisplay = document.getElementById("player-name");

const inventoryStyle = `
  position: fixed;
  top: 3.5rem;
  right: 1rem;
  width: 200px;
  z-index: 10;
`;

const equipmentStyle = `
  position: fixed;
  top: 3.5rem;
  left: 1rem;
  width: 200px;
  z-index: 10;
`;

const hudStyle = `
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffee88;
  font-family: monospace;
  padding: 0.75rem 1.5rem;
  border: 2px solid #ffee88;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 238, 136, 0.4);
  z-index: 1000;
`;

const backgrounds = {
  start: "https://i.postimg.cc/XYQ6xMYy/goblin-village-background-clean.png",
  call_out: "#1a1a1a",
  dig_ashes: "#440000",
  wander_off: "#003300",
  name_chosen: "purple"
};

let inventory = JSON.parse(JSON.stringify(originalInventory)); // Make a copy so it's not linked

let xp = 0;
let hasGainedXP = false;
document.getElementById("inventory").style.cssText = inventoryStyle;
document.getElementById("equipment").style.cssText = equipmentStyle;
document.getElementById("xp").innerText = `🧠 XP: ${xp}`;

function addItemByName(name, equip = false) {
  const base = itemData[name];
  if (!base) {
    console.warn(`Unknown item: ${name}`);
    return;
  }

  const newItem = {
    name,
    equipped: equip,
    draggable: base.draggable
  };

  inventory.push(newItem);
  updateInventoryDisplay();
  updateEquipmentDisplay();
}



function addToInventory(item) {
  inventory.push(item);
  updateInventoryDisplay();
}

function getEmoji(name) {
  return itemData[name]?.emoji || "🎒";
}


function updateInventoryDisplay() {
  const list = document.getElementById("inventory-list");
  list.innerHTML = "";

inventory.forEach(item => {
  const li = document.createElement("li");

  let name = typeof item === "string" ? item : item.name;
  let emoji = "🎒";

  if (name === "Beetle-Boo") emoji = "🧸";
  if (name === "Dirty Loin Cloth" || name === "Full Loin Cloth") emoji = "🩲";
  
  


  // Add (equipped) label for equipped items
  const isEquipped = typeof item === "object" && item.equipped;
  li.textContent = `${emoji} ${name}${isEquipped ? " (equipped)" : ""}`;

  li.style.cursor = "pointer";
  li.classList.add("item-button");
  if (isEquipped) li.classList.add("equipped-item");

  // Show tooltip on hover
  li.onmouseenter = (e) => {
    const tooltip = document.getElementById("item-tooltip");
    tooltip.innerText = getItemDescription(name);
    tooltip.style.display = "block";
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${e.clientY + 10}px`;
  };

  li.onmousemove = (e) => {
    const tooltip = document.getElementById("item-tooltip");
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${e.clientY + 10}px`;
  };

  li.onmouseleave = () => {
    const tooltip = document.getElementById("item-tooltip");
    tooltip.style.display = "none";
  };

  // Toggle equipped state on click
  if (typeof item === "object") {
    li.onclick = () => {
      item.equipped = !item.equipped;
      updateInventoryDisplay();
      updateEquipmentDisplay();
    };
  }

  list.appendChild(li);
});
     
     
     
} 
    
function updateEquipmentDisplay() {
  
  console.log("Running equipment display");
  const list = document.getElementById("equipment-list");
  list.innerHTML = "";

  inventory.forEach(item => {
    console.log("Checking item:", item);
    if (typeof item === "object" && item.equipped) {
      const li = document.createElement("li");
     let name = typeof item === "string" ? item : item.name;
let emoji = "🎒"; // default emoji

if (name === "Beetle-Boo") emoji = "🧸";
if (name === "Dirty Loin Cloth" || name === "Full Loin Cloth") emoji = "🩲";

      li.textContent = `${emoji} ${name}`;
      li.classList.add("equipped-item");
      li.style.cursor = "pointer";
      li.classList.add("equip-button");
      li.onmouseenter = (e) => {
        const tooltip = document.getElementById("item-tooltip");
        tooltip.innerText = getItemDescription(item.name);
        tooltip.style.display = "block";
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
      };

      li.onmousemove = (e) => {
        const tooltip = document.getElementById("item-tooltip");
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
      };

      li.onmouseleave = () => {
        const tooltip = document.getElementById("item-tooltip");
        tooltip.style.display = "none";
      };
          if (item.draggable && !li.classList.contains("draggable")) {
  li.classList.add("draggable");
  list.appendChild(li);  // append first so it has a parent
  makeSnappingDraggable(li);
} else {
  list.appendChild(li);
}
 
    
}
    
  });
}
    

function makeSnappingDraggable(el) {
  console.log(el)
  el.style.outline = "";
  let startLeft, startTop, offsetX, offsetY;
  let dragging = false;

  const parent = el.parentElement;
if (!parent) return; // 🛡️ Prevent crash

const rect = el.getBoundingClientRect();
const parentRect = parent.getBoundingClientRect();

  startLeft = rect.left - parentRect.left;
  startTop = rect.top - parentRect.top;

  el.style.position = "absolute";
  el.style.left = `${startLeft}px`;
  el.style.top = `${startTop}px`;
  el.style.zIndex = 1000;

  el.onmousedown = function (e) {
    e.preventDefault();
    dragging = true;

  const liveRect = el.getBoundingClientRect();
  const parentRect = el.parentElement.getBoundingClientRect();

  offsetX = e.clientX - liveRect.left;
  offsetY = e.clientY - liveRect.top;

  startLeft = liveRect.left - parentRect.left;
  startTop = liveRect.top - parentRect.top;

  // 🛠️ Lock size before absolute positioning
  el.style.width = `${el.offsetWidth}px`;
  el.style.height = `${el.offsetHeight}px`;

  el.style.position = "absolute";
  el.style.left = `${startLeft}px`;
  el.style.top = `${startTop}px`;
  el.style.zIndex = 1000;


    document.onmousemove = drag;
    document.onmouseup = drop;
    document.body.addEventListener("mouseleave", drop);
    window.addEventListener("blur", drop); // backup
  };

  function drag(e) {
    if (!dragging) return;
    const parentRect = el.parentElement.getBoundingClientRect();
    el.style.left = `${e.clientX - parentRect.left - offsetX}px`;
    el.style.top = `${e.clientY - parentRect.top - offsetY}px`;
  }

  function drop() {
    if (!dragging) return;
    dragging = false;
    
    document.getElementById("item-tooltip").style.display = "none";
    document.onmousemove = null;
    document.onmouseup = null;
    document.body.removeEventListener("mouseleave", drop);
    window.removeEventListener("blur", drop);

    const dropZone = document.getElementById("drop-zone");
    if (dropZone) {
      const dzRect = dropZone.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      const isInside =
        elRect.right > dzRect.left &&
        elRect.left < dzRect.right &&
        elRect.bottom > dzRect.top &&
        elRect.top < dzRect.bottom;

      if (isInside) {
        console.log("Dropped in special zone!");
        return;
      }
    }

    el.style.left = `${startLeft}px`;
    el.style.top = `${startTop}px`;
  }
}

const scenes = {};
const choices = {};


function addScene(id, text, choiceArray) {
  scenes[id] = text;
  choices[id] = choiceArray;
}



addScene("start", 
  `You come to in the ashes of your burnt-down home.\nYou clutch Beetle-Boo, your favorite plush beetle.\nThe world feels too quiet now. What do you do?`,
  [
    { text: "Call out for anyone who might have survived", next: "call_out" },
    { text: "Examine yourself", next: "examine_self_1" },
    { text: "Wander away — anywhere but here", next: "wander_off" }
  ]
);

addScene("call_out", 
  "You call out.\nA split moment in time happens.\nYou hear a whistle.",
  [
    { text: "Maybe your victory is in another answer.", next: "start" }
  ]
);

addScene("examine_self_1", 
  "Ash in tiny fists\nClutching soot and stuffed silence\nNo name, but still warm",
  [
    { text: "Start Over", next: "start" },
    { text: "Examine yourself", next: "examine_self_1" },
    { text: "Wander away — anywhere but here", next: "wander_off" }
  ]
);

addScene("wander_off", 
  "You stand up slowly, soot slipping from your arms like powder.\nYou step away from what's left behind.\n\n",
  [
    { text: "Start Over", next: "start" },
    { text: "Examine yourself", next: "examine_self_1" },
    { text: "Wander away — anywhere but here", next: "wander_off" }
  ]
);

addScene("name_chosen", 
  "You remember... or invent... a name. It feels real now.",
  [
     { text: "Call out for anyone who might have survived", next: "call_out" },
    { text: "Wander away — anywhere but here", next: "wander_off" }
  ]
);

 function getItemDescription(name) {
  return itemData[name]?.description || `${name}: No description available.`;
}

    
function setBackground(value) {
  if (value.startsWith("http")) {
    document.body.style.backgroundImage = `url('${value}')`;
    document.body.style.backgroundColor = ""; // remove color if switching to image
  } else {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = value;
  }
}


function showScene(key) {
const text = scenes[key];
document.getElementById("story").innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
if (key === "call_out") {
  inventory = inventory.map(item => {
    if (typeof item === "object" && item.name === "Dirty Loin Cloth") {
      return { ...item, name: "Full Loin Cloth" }; // ✅ keep draggable and equipped
    }
    return item;
  });
}
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  const currentChoices = choices[key] || [];
choicesContainer.innerHTML = "";

currentChoices.forEach(choice => {
  const btn = document.createElement("button");
  btn.textContent = choice.text;
  btn.classList.add("choice");
  btn.onclick = () => {
  if (choice.next === "start") {
    resetGame();
  } else {
    showScene(choice.next);
  }
};
  choicesContainer.appendChild(btn);
});

if (!hasGainedXP && key !== "start") {
  xp += 1;
  hasGainedXP = true;
  document.getElementById("status-bar").style.display = "block";
  document.getElementById("xp").innerText = `🧠 XP: ${xp}`;
}

  updateInventoryDisplay();
  updateEquipmentDisplay();
  
  if (backgrounds[key]) {
  setBackground(backgrounds[key]);
}
  if (key === "wander_off") {
  addToInventory({ name: "Bone Dagger", equipped: false, draggable: true });
}
 const nameInput = document.getElementById("name-input");
const nameDisplay = document.getElementById("player-name");

if (key === "examine_self_1" && !nameDisplay.textContent) {
  nameInput.style.display = "inline-block";
  nameInput.focus();

  nameInput.onkeydown = (e) => {
    if (e.key === "Enter" && nameInput.value.trim()) {
      const name = nameInput.value.trim();
      nameDisplay.textContent = name;
      nameDisplay.style.display = "inline";
      nameInput.style.display = "none";
      nameInput.value = "";

      xp += 1;
      document.getElementById("xp").innerText = `🧠 XP: ${xp}`;
      hasGainedXP = true;

      showScene("name_chosen");
    }
  };
} else {
  nameInput.style.display = "none";
}

  const descBox = document.getElementById("item-description");
  descBox.style.display = "none";

 
}


function makeDraggable(el) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  el.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.querySelectorAll('.draggable').forEach(makeDraggable);


// RESET

function resetGame() {
  
  // Reset XP and flags
  xp = 0;
  hasGainedXP = false;
  document.getElementById("xp").innerText = `🧠 XP: ${xp}`;
  document.getElementById("status-bar").style.display = "none";
  
  // Reset panel positions to layout flow
document.getElementById("inventory").style.cssText = inventoryStyle;
document.getElementById("equipment").style.cssText = equipmentStyle;
  
  // Hide and reset status bar
  const statusBar = document.getElementById("status-bar");
  statusBar.style.display = "none";
  
  
  
  
  // Reset inventory
 inventory = originalInventory.map(item => ({ ...item }));
  
  const invPanel = document.getElementById("inventory");
const equipPanel = document.getElementById("equipment");

invPanel.style.cssText = `
  position: fixed;
  top: 3.5rem;
  right: 1rem;
  width: 200px;
  z-index: 10;
`;

equipPanel.style.cssText = `
  position: fixed;
  top: 3.5rem;
  left: 1rem;
  width: 200px;
  z-index: 10;
`;
  

  
  // Clear item description
  const descBox = document.getElementById("item-description");
  descBox.innerText = "";
  descBox.style.display = "none";

  // Show the first scene
  showScene("start");
  
  setBackground(backgrounds.start);
}

// reset end
showScene("start");
updateInventoryDisplay();
updateEquipmentDisplay();