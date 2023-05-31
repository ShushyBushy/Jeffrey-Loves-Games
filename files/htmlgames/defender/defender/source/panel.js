/**
 * The Panel Class
 */
class Panel {

    /**
     * The Panel constructor
     */
    constructor() {
        this.hasStarted = false;
        this.container  = document.querySelector(".description");
        this.towerSel   = null;
        this.mobSel     = null;
        this.width      = 161;
    }



    /**
     * Updates the inner started state when the game starts
     * @returns {Void}
     */
    gameStarted() {
        this.hasStarted = true;
    }

    /**
     * Shows the Tower Preview Description
     * @param {Tower} tower
     * @returns {Void}
     */
    previewTower(tower) {
        this.create(
            tower.getName(true),
            tower.text,

            this.towerInfo({
                aCost   : tower.actualCost,
                aDamage : tower.actualDamage,
                isBoost : tower.isBoost,
                aRange  : tower.getActualRange(),
                aSpeed  : tower.actualSpeed,
            })
        );
        this.towerSel = null;
        this.mobSel   = null;
    }



    /**
     * Shows the given Tower Loading bar or Information
     * @param {Tower}  tower
     * @param {Number} gold
     * @returns {Void}
     */
    showTower(tower, gold) {
        if (tower.isLoading) {
            this.showLoad(tower);
        } else {
            this.showInfo(tower, gold);
        }
        this.towerSel = tower;
        this.mobSel   = null;
    }

    /**
     * Shows the given Tower Loading Bar
     * @param {Tower} tower
     * @returns {Void}
     */
    showLoad(tower) {
        this.create(
            tower.getName(),
            tower.text,
            this.towerLoading(tower.loadValue)
        );
    }

    /**
     * Shows the given Tower Information
     * @param {Tower}  tower
     * @param {Number} gold
     * @returns {Void}
     */
    showInfo(tower, gold) {
        this.create(
            tower.getName(),
            tower.text,

            this.towerInfo({
                aCost   : tower.actualCost,
                uCost   : tower.upgradeCost,
                aDamage : tower.actualDamage,
                uDamage : tower.upgradeDamage,
                isBoost : tower.isBoost,
                boost   : tower.boost,
                aRange  : tower.getActualRange(),
                uRange  : tower.upgradeRange,
                aSpeed  : tower.actualSpeed,
                uSpeed  : tower.upgradeSpeed,
            }),

            this.towerButtons({
                cantUpgrade : tower.upgradeCost > gold,
                isMaxed     : tower.isMaxLevel,
                canLock     : tower.canLock,
                isLocked    : tower.isLocked,
                canFire     : tower.canFire && this.hasStarted,
                price       : tower.getPrice(this.hasStarted)
            })
        );
    }



    /**
     * Shows the given Mob Information
     * @param {Mob} mob
     * @returns {Void}
     */
    showMob(mob) {
        this.create(
            mob.name,
            `${mob.wave}. ${mob.text}`,
            this.mobInfo(mob.life, mob.gold, mob.speed)
        );
        this.towerSel = null;
        this.mobSel   = mob;
    }


    /**
     * Creates the Description HTML
     * @param {String} name
     * @param {String} text
     * @param {String} information
     * @param {String} buttons
     * @returns {Void}
     */
    create(name, text, information, buttons) {
        this.container.innerHTML = `
            <h2>${name}</h2>
            <div class="content">
                <p>${text}</p>
                <div class="information">${information}</div>${buttons || ""}
            </div>
        `;
        this.container.className = "description fadeIn";
    }

    /**
     * Creates the Tower Information HTML
     * @param {Object} data
     * @returns {String}
     */
    towerInfo(data) {
        return `
            <div class="towerCost">
                <div class="text">Cost:</div>
                <div class="actual">${data.aCost}</div>
                <div class="next">${data.uCost ? `+${data.uCost}` : ""}</div>
            </div>
            <div class="towerDamage">
                <div class="text">Damage:</div>
                <div class="actual">${data.aDamage}${data.isBoost ? "%" : ""}</div>
                <div class="next">${data.uDamage ? `+${data.uDamage}${data.isBoost ? "%" : ""}` : ""}</div>
            </div>
            <div class="towerDistance">
                <div class="text">Range:</div>
                <div class="actual">${data.aRange}</div>
                <div class="next">${data.uRange ? `+ ${data.uRange}` : ""}</div>
            </div>
            <div class="towerSpeed">
                <div class="text">Speed:</div>
                <div class="actual">${data.aSpeed}</div>
                <div class="next">${data.uSpeed || ""}</div>
            </div>
            <div class="towerBoost">${data.boost ? `Boost: ${data.boost} %` : ""}</div>
        `;
    }

    /**
     * Creates the Tower Buttons HTML
     * @param {Object} data
     * @returns {String}
     */
    towerButtons(data) {
        const classes = [];
        let   button  = "";

        if (data.isMaxed) {
            classes.push("hideButtons");
        }
        if (data.cantUpgrade) {
            classes.push("cantUpgrade");
        }
        if (data.canFire) {
            classes.push("extraButton");
        }

        if (data.canFire) {
            button = `<button class="actionButton menuButton" data-action="fire">Fire!</button>`;
        } else if (data.canLock) {
            button = `<button class="actionButton menuButton" data-action="lock">${data.isLocked ? "Unlock" : "Lock"}</button>`;
        }

        return `
            <div class="${classes.join(" ")}">
                <button class="upgradeButton menuButton" data-action="upgrade">Upgrade</button>
                ${button}
                <button class="sellButton menuButton" data-action="sell">Sell &#36; ${data.price}</button>
            </div>
        `;
    }

    /**
     * Creates the Tower Loading HTML
     * @param {Number} data
     * @returns {String}
     */
    towerLoading(loaded) {
        return `
            <div class="descLoad">
                <div class="descLoadBar" style="width: ${loaded * this.width}px"></div>
            </div>
        `;
    }

    /**
     * Creates the Mob Information HTML
     * @param {Number} life
     * @param {Number} gold
     * @param {Number} speed
     * @returns {String}
     */
    mobInfo(life, gold, speed) {
        return `
            <div class="mobPoints">
                <div class="text">Life:</div>
               <div class="actual">${Math.round(life)}</div>
            </div>
            <div class="mobGold">
                <div class="text">Gold:</div>
                <div class="actual">${gold}</div>
            </div>
            <div class="mobSpeed">
                <div class="text">Speed:</div>
                <div class="actual">${speed}</div>
            </div>
        `;
    }



    /**
     * Hides the Panel after a few seconds
     * @returns {Void}
     */
    disappear() {
        this.towerSel = null;
        this.mobSel   = null;
        this.container.className = "description delayedFadeOut";
    }

    /**
     * Hides the Panel inmediatelly
     * @returns {Void}
     */
    hide() {
        this.towerSel = null;
        this.mobSel   = null;
        this.container.className = "description fadeOut";
    }



    /**
     * Updates the Description of the currently selected Mob
     * @returns {Void}
     */
    updateMob(mob) {
        if (this.mobSel && this.mobSel.id === mob.id) {
            this.showMob(mob);
        }
    }

    /**
     * Hides the Description of the Mob
     * @returns {Void}
     */
    destroyMob(mob) {
        if (this.mobSel && this.mobSel.id === mob.id) {
            this.hide();
        }
    }
}
