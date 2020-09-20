/**
 * There are 8 Classes Used for this project.
 * - Utility : Utility functions that are used several times for the project.
 * - Player : Player Object. This contains player's name and character setting.
 * - Character : Character Object with 4 Attribute Object ( Strength, Dexterity, Mind, Presence ).
 *               Character Object has its base Attribute which determines hero's skill set. Like if baseAttr is Strength, then he can have skills like `Fighting`
 *               Character Object also contains CombatAttribute Object for storing ('vitality', 'evasion', 'armor', 'alacrity', 'tenacity', 'power')
 *               Character Object can contains multiple traits (For example, strength minimum value is 10, This character has a bow so Fighting Rank + 1 etc) 
 *                      and equipments like Bow which adds 3 power to the character etc.
 * - CombatAttribute : Used for storing character's 'vitality', 'evasion', 'armor', 'alacrity', 'tenacity', 'power'
 * - Attribute : Strength, Dexterity, Mind, Presence.
 * - Skill : Several Skills, fight, thievery, stealth etc...
 * - Equipment : Currently we have EQUIP_CHEST_ARMOR, and EQUIP_BOW
 * - Trait : Currently we have TRAIT_FIGHTER (Skill Fighting Rank + 1), TRAIT_HOLDING_BOW (Evasion + 2), TRAIT_STRENGTH (Strength + 5, Dexterity + 2, Mind + 1, Presence + 3)
 */

/**
 * Attributes Type Constant
 */
const ATTR_STRENGTH = "strength"; // vitality = strength + 3
const ATTR_DEXTERITY = "dexterity"; // evasion = 10 + dexterity
const ATTR_MIND = "mind"; // alacrity = mind
const ATTR_PRESENCE = "presence"; // alacrity = presence, tenacity = 1 + presence

/**
 * Skill Rank Constant
 */
const SKILL_RANK_UNTRAINED = 0;
const SKILL_RANK_NOVICE = 1;
const SKILL_RANK_APPRENTICE = 2;
const SKILL_RANK_ADEPT = 3;
const SKILL_RANK_EXPERT = 4;
const SKILL_RANK_MASTER = 5;

/**
 * Skill Type Constant
 */
const SKILL_FIGHTING = "fight";
const SKILL_THIEVERY = "thievery";
const SKILL_STEALTH = "stealth";
const SKILL_ARCHERY = "archery";
const SKILL_LEARNED = "learned";
const SKILL_SURVIVAL = "survival";
const SKILL_PERCEPTION = "perception";
const SKILL_APOTHECARY = "apothecary";
const SKILL_INTIMIDATION = "intimidation";
const SKILL_PERFORMANCE = "performance";
const SKILL_MANIPULATION = "manipulation";
const SKILL_INSIGHT = "insight";
const SKILL_POWER = "power";

/**
 * Equipment Slot Types. 
 */
const EQUIP_SLOT_ARMOR = "equip_slot_armor";
const EQUIP_SLOT_WEAPON = "equip_slot_weapon";

/**
 * Constant for Slot's equipment limitation
 */
const CHARACTER_EQUIP_SLOT_LIMIT = {
    [EQUIP_SLOT_ARMOR]: 1,
    [EQUIP_SLOT_WEAPON]: 3
}

/**
 * Equipment Type Chest Armor Constant
 * Gives Additional 1 Armor
 */
const EQUIP_CHEST_ARMOR = "equip_chest_armor";
/**
 * Equipment Type Bow Constant
 * Gives Additional 3 Power
 */
const EQUIP_BOW = "equip_bow";

/**
 * Mapper for showing which equipment can be in which slot
 */
const EQUIP_SLOT_MAP = {
    [EQUIP_SLOT_ARMOR]: [
        EQUIP_CHEST_ARMOR
    ],
    [EQUIP_SLOT_WEAPON]: [
        EQUIP_BOW
    ]
}

/**
 * Mapper for what attribute can have what skills.
 */
const ATTR_SKILL_MAP = {
    [ATTR_STRENGTH]: [
        SKILL_FIGHTING
    ],
    [ATTR_DEXTERITY]: [
        SKILL_FIGHTING, SKILL_THIEVERY, SKILL_STEALTH, SKILL_ARCHERY
    ],
    [ATTR_MIND]: [
        SKILL_LEARNED, SKILL_SURVIVAL, SKILL_PERCEPTION, SKILL_APOTHECARY
    ],
    [ATTR_PRESENCE]: [
        SKILL_INTIMIDATION, SKILL_PERFORMANCE, SKILL_MANIPULATION, SKILL_INSIGHT, SKILL_POWER
    ],
    [ATTR_MIND]: [
        SKILL_POWER
    ]
};

/**
 * Trait Types
 */
const TRAIT_STRENGTH = "trait_strength"; // Additional Strength + 5, Dexterity + 2, Mind + 1, Presence + 3
const TRAIT_HOLDING_BOW = "trait_holding_bow"; // Additional Evasion + 2
const TRAIT_FIGHTER = "trait_fighter"; // Add Bonus Rank to Fighting Skill

/**
 * Utility class used for getting global constants and frequent functions
 */
class Utility {
    static getInstance() {
        if (!window.utility) {
            window.utility = new Utility();
        }
        return window.utility;
    }
    
    getAttrSkillMap() {
        // To avoid direct changes on constant
        return JSON.parse(JSON.stringify(ATTR_SKILL_MAP));
    }

    getEquipSlotMap() {
        return JSON.parse(JSON.stringify(EQUIP_SLOT_MAP));
    }

    getCharacterEquipSlotLimit() {
        return JSON.parse(JSON.stringify(CHARACTER_EQUIP_SLOT_LIMIT));
    }

    randomBetween(left, right) {
        return Math.floor(Math.random() * right) + left;
    }

    clone(obj) {
        return Object.create(
            Object.getPrototypeOf(obj), 
            Object.getOwnPropertyDescriptors(obj) 
        );
    }

    serialize (obj) {
        return JSON.stringify(
          obj,
          function (k, v) {
            if (this[k] instanceof Date) {
              return ['__date__', +this[k]]
            }
            return v
          }
        )
      }
      
      deserialize (s) {
        return JSON.parse(
          s,
          (_, v) => (Array.isArray(v) && v[0] === '__date__') ? new Date(v[1]) : v
        )
      }
}

/**
 * Main Player Objects. Can change name, export and import.
 * This will render html to a DOM element
 */
class Player {
    constructor(name) {
        this.name = name || "";
        this.character = null;
        this.domID = "player";
    }

    /**
     * Change
     * @param {*} name 
     */
    setName(name) {
        this.name = name;
    }

    setCharacter(character) {
        this.character = character;
    }

    export() {
        window.playerExport = Utility.getInstance().serialize(this);
        alert("Export succeeded. Please try to change name and import");
    }

    import() {
        if (!window.playerExport) {
            alert("You need to export first");
            return;
        }
        const data = Utility.getInstance().deserialize(window.playerExport);
        this.name = data.name;
        this.domID = data.domID;
        alert("Import Finished");
        this.refresh();
        console.log(this.character);
        this.character.refresh();
    }

    /**
     * Render HTML into dom object with id
     * @param {*} id 
     */
    render(id) {
        this.domID = id;
        const html = `
        <div class="row">
            <div class="col">
                <h3>Player</h3>
                <div class="row">
                    <div class="col">Name</div>
                    <div class="col">${this.name}</div>
                </div>
            </div>
        </div>
        `;
        document.getElementById(id).innerHTML = html;
    }

    /**
     * Refresh UI for Player Info
     */
    refresh() {
        this.render(this.domID);
    }
}

/**
 * Character Object.
 * It has baseAttribute, name, equipments, and traits. 
 * According to baseAttribute, Skills will be determined, Additional equipments and traits will give bonus value to Attributes and Combat Attributes
 */
class Character {
    constructor(name, baseAttribute, equipments = [], traits = []) {
        this.attributes = {
            [ATTR_STRENGTH]: new Attribute(ATTR_STRENGTH),
            [ATTR_DEXTERITY]: new Attribute(ATTR_DEXTERITY),
            [ATTR_MIND] : new Attribute(ATTR_MIND),
            [ATTR_PRESENCE]: new Attribute(ATTR_PRESENCE)
        };
        this.name = name || "";
        this.combatAttribute = new CombatAttribute();
        this.bonusCombatAttribute = new CombatAttribute();
        this.damageTaken = 0;
        this.baseAttributeType = baseAttribute;
        this.skills = [];
        this.equipments = equipments;
        this.traits = traits;
        this.domID = 'character';
        this.update();
    }

    update(isUpdate) {
        this.fetchSkills(isUpdate);
        this.fetchCombat();
    }

    /**
     * Get Base Attribute
     */
    getBaseAttribute() {
        return this.fetchAttributes()[this.baseAttributeType];
    }

    setBaseAttributeType(type) {
        this.baseAttributeType = type;
    }

    getAttributeBy(type) {
        return this.attributes[type];
    }

    setAttributeBy(type, value) {
        this.getAttributeBy(type).set(parseInt(value));
        this.update();
    }

    getSkillByType(type) {
        const filter = this.skills.filter(skill => {
            return skill.type == type;
        })
        if (filter.length == 0) return null;
        return filter[0];
    }

    /**
     * Take damage
     */
    takeDamage(damage) {
        this.damageTaken += damage;
    }

    /**
     * Get Combat Attribute of Character
     */
    fetchCombat() {
        this.combatAttribute = CombatAttribute.merge(
            ...Object.values(this.fetchAttributes()).map(attr => attr.fetchCombat()), 
            ...Object.values(this.equipments).map(equipment => equipment.fetchCombat()),
            this.bonusCombatAttribute
        );
        this.combatAttribute.vitality -= this.damageTaken;
        return this.combatAttribute;
    }

    /**
     * Get All Attributes combining traits and its base attributes
     */
    fetchAttributes() {
        let result = {};
        Object.values(this.attributes).map(attribute => {
            result[attribute.type] = Utility.getInstance().clone(attribute);
        })
        this.traits.map(trait => {
            Object.values(trait.fetchAttributes()).map(attribute => {
                result[attribute.type].add(attribute.get());
            })
        });
        return result;
    }

    /**
     * Get Skills based upon Base Attribute
     */
    fetchSkills(isUpdate) {
        if (this.skills.length == 0 || isUpdate) {
            this.skills = [];
            const map = Utility.getInstance().getAttrSkillMap();
            map[this.baseAttributeType].map(skillName => {
                const skill = new Skill(this.getBaseAttribute(), skillName);
                this.skills.push(skill);
            });
            this.skills.map(skill => {
                this.traits.map(trait => {
                    Object.keys(trait.skills).map(skillType => {
                        if (skillType == skill.type) {
                            skill.addBonusRank(trait.getSkillRankBy(skill.type));
                        }
                    });
                })
            });
        } else {
            this.skills.map(skill => {
                skill.setBaseAttribute(this.getBaseAttribute());
            })
        }
        return this.skills;
    }

    getEquipmentsBy(type) {
        return this.equipments.filter(equipment => {
            return equipment.type == type;
        });
    }

    addEquipment(equipment) {
        const type = equipment.type;
        const slotLimitMap = Utility.getInstance().getCharacterEquipSlotLimit();
        const equipmentLimit = slotLimitMap[equipment.getSlot()];
        if (this.getEquipmentsBy(type).length == equipmentLimit) {
            return false;
        }
        this.equipments.push(equipment);
        this.update();
        return true;
    }

    /**
     * Used for rendering
     */
    getTraitAttributeValueBy(type) {
        let result = 0;
        this.traits.map(trait => {
            Object.values(trait.fetchAttributes()).map(attribute => {
                if (attribute.type == type) {
                    result += attribute.get();
                }
            })
        });
        if (result == 0) return "";
        return ` + ${result} (Trait)`;
    }

    addTrait(trait) {
        this.traits.push(trait);
        this.update();
    }

    render(id) {
        this.domID = id;
        const html = `
        <div class="row mt-5">
            <div class="col">
                <h3>Attributes</h3>
                ${Object.values(this.attributes).map(attribute => {
                    return `<div class="row">
                        <div class="col ${this.getBaseAttribute().type == attribute.type ? 'font-weight-bold' : ''}">${attribute.type}</div>
                        <div class="col">${attribute.value}${this.getTraitAttributeValueBy(attribute.type)}</div>
                        <div class="col"><button onclick="changeAttribute('${attribute.type}')">Change</button></div>
                        <div class="col"><button onclick="setAsBaseAttribute('${attribute.type}')">Set As Base</button></div>
                    </div>`;
                }).join("\n")}
            </div>
            <div class="col">
                <h3>Combat Attributes</h3>
                ${Object.values(CombatAttribute.getProperties()).map(property => {
                    return `<div class="row">
                        <div class="col">${property}</div>
                        <div class="col">${this.fetchCombat()[property]} ${property=="vitality" ? "( "+this.damageTaken+" Damage Taken)" : ""}</div>
                    </div>`;
                }).join("\n")}
            </div>
            <div class="w-100 mt-3"></div>
            <div class="col">
                <h3>Skills</h3>
                ${Object.values(this.fetchSkills()).map(skill => {
                    return `<div class="row">
                        <div class="col text-capitalize">${skill.type}</div>
                        <div class="col">${Skill.getNameFromRank(skill.fetchRank())}</div>
                        <div class="col">${skill.fetchLevel()}</div>
                        <div class="col"><button onclick="refreshSkillValue('${skill.type}')">Refresh Value</button></div>
                    </div>`;
                }).join("\n")}
            </div>
            <div class="col">
                <div>
                    <h3>Equipments</h3>
                    ${Object.values(this.equipments).map(equipment => {
                        return `<div class="row">
                            <div class="col">${equipment.getName()}</div>
                        </div>`;
                    }).join("\n")}
                </div>
                <div class="mt-3">
                    <h3>Traits</h3>
                    ${Object.values(this.traits).map(trait => {
                        return `<div class="row">
                            <div class="col">${trait.getName()}</div>
                        </div>`;
                    }).join("\n")}
                </div>
            </div>
        </div>
        `;
        document.getElementById(id).innerHTML = html;
    }

    refresh() {
        this.render(this.domID);
    }
}

/**
 * Combat Attribute
 */
class CombatAttribute {
    constructor() {
        this.vitality = 0;
        this.evasion = 0;
        this.armor = 0;
        this.alacrity = 0;
        this.tenacity = 0;
        this.power = 0;
    }

    static merge(...attrs) {
        const result = new CombatAttribute();
        attrs.map(attr => {
            CombatAttribute.getProperties().map(property => {
                result[property] += attr[property];
            });
        });
        return result;
    }

    static getProperties() {
        return ['vitality', 'evasion', 'armor', 'alacrity', 'tenacity', 'power'];
    }
}

class Attribute {
    constructor(type, value = 0) {
        this.value = value;
        this.combatAttribute = new CombatAttribute();
        this.type = type;
        this.fetchCombat();
    }

    add(value) {
        this.value += value;
    }

    set(value) {
        this.value = value;
        this.fetchCombat();
    }

    get() {
        return this.value;
    }

    fetchCombat() {
        if (this.type == ATTR_STRENGTH) {
            this.combatAttribute.vitality = 3 + this.value;
        } else if (this.type == ATTR_DEXTERITY) {
            this.combatAttribute.evasion = 10 + this.value;
        } else if (this.type == ATTR_MIND) {
            this.combatAttribute.alacrity = this.value;
        } else if (this.type == ATTR_PRESENCE) {
            this.combatAttribute.alacrity = this.value;
            this.combatAttribute.tenacity = 1 + this.value;
        }
        this.combatAttribute.armor = this.combatAttribute.evasion;
        return this.combatAttribute;
    }
}

class Skill {
    constructor(baseAttribute, type) {
        this.level = 0;
        this.rank = SKILL_RANK_UNTRAINED;
        this.bonusRank = 0;
        this.type = type;
        this.baseAttribute = baseAttribute;
        this.update();
    }

    static getNameFromRank(rank) {
        if (rank == SKILL_RANK_UNTRAINED) return "UnTrained";
        if (rank == SKILL_RANK_NOVICE) return "Novice";
        if (rank == SKILL_RANK_APPRENTICE) return "Apprentice";
        if (rank == SKILL_RANK_ADEPT) return "Adept";
        if (rank == SKILL_RANK_EXPERT) return "Expert";
        if (rank == SKILL_RANK_MASTER) return "Master";
        return "UnTrained";
    }

    setBaseAttribute(baseAttribute) {
        this.baseAttribute = baseAttribute;
        this.update();
    }

    removeBonusRank() {
        this.bonusRank = 0;
    }

    addBonusRank(value) {
        this.bonusRank = value;
    }

    update() {
        this.fetchRank();
        if (this.level == 0) {
            this.fetchLevel(true);
        }
    }

    fetchRank() {
        const value = this.baseAttribute.get() + this.bonusRank;
        this.rank = SKILL_RANK_MASTER;
        if (value < 25) {
            this.rank = SKILL_RANK_EXPERT;
        }
        if (value < 20) {
            this.rank = SKILL_RANK_ADEPT;
        }
        if (value < 15) {
            this.rank = SKILL_RANK_APPRENTICE;
        }
        if (value < 10) {
            this.rank = SKILL_RANK_NOVICE;
        }
        if (value < 5) {
            this.rank = SKILL_RANK_UNTRAINED;
        }
        return this.rank;
    }

    fetchLevel(isUpdate) {
        if (isUpdate) {
            if (this.rank == SKILL_RANK_UNTRAINED) {
                this.level = Math.min(
                    Utility.getInstance().randomBetween(1, 20),
                    Utility.getInstance().randomBetween(1, 20)
                );
            } else {
                this.level = Utility.getInstance().randomBetween(1, 20) + Utility.getInstance().randomBetween(1, 4 + 2 * (this.rank - 1));
            }
        }
        return this.level;
    }
}

class Equipment {
    constructor(type) {
        this.type = type;
        this.combatAttribute = new CombatAttribute();
        this.fetchCombat();
    }

    getName() {
        if (this.type == EQUIP_BOW) return "Bow";
        if (this.type == EQUIP_CHEST_ARMOR) return "Chest Armor";
        return "Unknown";
    }

    getSlot() {
        const equipSlotMap = Utility.getInstance().getEquipSlotMap();
        return Object.keys(equipSlotMap).filter(slot => {
            return equipSlotMap[slot].includes(this.type);
        })[0];
    }

    fetchCombat() {
        if (this.type == EQUIP_CHEST_ARMOR) {
            this.combatAttribute.armor = 1;
        } else if (this.type == EQUIP_BOW) {
            this.combatAttribute.power = 3;
        }
        return this.combatAttribute;
    }
}

class Trait {
    constructor(type) {
        this.type = type;
        this.attributes = {};
        this.skills = {};
        this.combatAttribute = new CombatAttribute();
        this.initTrait();
    }

    initTrait() {
        switch (this.type) {
            case TRAIT_STRENGTH:
                this.attributes[ATTR_STRENGTH] = new Attribute(ATTR_STRENGTH, 5);
                this.attributes[ATTR_DEXTERITY] = new Attribute(ATTR_DEXTERITY, 2);
                this.attributes[ATTR_MIND] = new Attribute(ATTR_MIND, 1);
                this.attributes[ATTR_PRESENCE] = new Attribute(ATTR_PRESENCE, 3);
                break;
            case TRAIT_HOLDING_BOW:
                this.combatAttribute.evasion = 2;
                break;
            case TRAIT_FIGHTER:
                this.skills[SKILL_FIGHTING] = {
                    rank: 1
                };
                break;
        }
    }

    getName() {
        if (this.type == TRAIT_STRENGTH) return "Strength";
        if (this.type == TRAIT_FIGHTER) return "Fighter";
        if (this.type == TRAIT_HOLDING_BOW) return "Holding Bow";
        return "Unknown";
    }

    getSkillRankBy(skillType) {
        const skillValues = this.skills[skillType]
        if (!skillValues) {
            return 0;
        }
        return skillValues.rank;
    }

    addAttribute(attribute) {
        this.attributes.push(attribute);
    }

    fetchAttributes() {
        return this.attributes;
    }

    fetchCombat() {
        return this.combatAttribute;
    }
}
