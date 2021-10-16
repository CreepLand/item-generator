const defaults = require('./defaults/default');
const prompt = require('prompt-sync')();
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('./config.yml'), 'utf8').config;
const file = config.submodule ? './item-contributions/item.yml' : './item.yml';

function stringify(obj) {
    return yaml.dump(obj);
}

(async () => {
    if(!fs.existsSync(file)) {
        if(config.submodule) {
            console.error("")
            console.error("[!] Submodule mode is enabled, but it was not initialized. Exiting...");
            return process.exit();
        }

        console.warn("")
        console.warn("[!] Unable to find a valid item.yml file, creating one with default values...");
        await fs.writeFileSync(file, stringify(defaults.file));
    }

    if(config.submodule) {
        console.info("[!] Using Git submodules.")
    }

    var document = await yaml.load(fs.readFileSync(file), 'utf8');

    if(document) {
        if(document["items"] === undefined) {
            const timestamp = Date.now();

            console.warn(``);
            console.warn(`[!] Found a item.yml file, but the contents were invalid. Creating one with default values and moving old contents to "item-${timestamp}-old.yml"...`);
            
            await fs.writeFileSync(`./old/item-${timestamp}-old.yml`, stringify(document));
            await fs.writeFileSync(file, stringify(defaults.file));

            document = await yaml.load(fs.readFileSync(path), 'utf8');
        }
    }

    console.info("")
    console.info("[!] Welcome to the CreepLand item generator!");
    console.info("[!] Just follow the on-screen instructions on how to use it and you should be fine.");
    console.info("[!] Please note that some items are not used in-game and will appear here (for example AIR). In that case, just press ENTER for each value without entering anything.");
    console.info("");

    // For some reason code below this won't work if we don't stringify it first
    var json = JSON.parse(JSON.stringify(document, null, 2));

    // Default items are in another file because, well, they're a little long...
    const items = defaults.items;
    let skip = false;
    items.forEach(async(item) => {
        if(json.items && json.items[item]) {
            skip = true;
            console.info("[!] Skipping " + item + " as it is already defined.")
        } else {
            
            if(skip) {
                console.info("");
            }

            console.info(`[!] Configuring item with name ${item}:`)
            
            let rarity = promptRarity();
            let damage = promptNumberAttribute(0, "damage");
            let attackSpeed = promptNumberAttribute(0, "attack speed");
            let health = promptNumberAttribute(0, "health");
            let defense = promptNumberAttribute(0, "defense");
            let cooldown = promptNumberAttribute(0, "cooldown");
            let feeds = promptNumberAttribute(0, "feeds");

            json.items[item] = {
                rarity: rarity,
                attributes: {
                    damage: damage,
                    attack_speed: attackSpeed,
                    health: health,
                    defense: defense,
                    cooldown: cooldown,
                    feeds: feeds
                }
            }
            
            const content = stringify(json);
            fs.writeFileSync(file, content); // Automatically save changes to prevent data loss

            console.info("");
            const input = prompt("[!] Finished configuring item " + item + ", type exit if you want to stop now: ");

            if(input === "exit") {
                console.info("");
                process.exit();
            }
        }
    });
})();

function promptRarity() {
    let rarity = prompt("[?] What should be the rarity of this item? (COMMON/UNCOMMON/RARE/EPIC/LEGENDARY/SPECIAL - default: COMMON): ");
            
    if(!rarity) {
        rarity = "COMMON";
    }

    while(rarity !== "COMMON" && rarity !== "UNCOMMON" && rarity !== "RARE" && rarity !== "EPIC" && rarity !== "LEGENDARY" && rarity !== "SPECIAL") {
        rarity = prompt("[?] Invalid rarity provided, what should be the rarity of this item? (COMMON/UNCOMMON/RARE/EPIC/LEGENDARY/SPECIAL - default: COMMON): ").toUpperCase();
    }

    return rarity;
}

function promptNumberAttribute(def, name) {
    let attribute = prompt("[?] What should be the " + name + " attribute of this item? (Must be a number, default: " + def + "): ");
    
    if(!attribute) {
        attribute = 0;
    }

    while(isNaN(attribute)) {
        attribute = prompt("[?] Invalid " + name + " value provided, please try again. (Must be a number, default: " + def + "): ");
    }

    return attribute;
}