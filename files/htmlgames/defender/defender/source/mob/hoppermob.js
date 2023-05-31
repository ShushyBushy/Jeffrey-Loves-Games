/**
 * The Hopper Mob Class
 * @extends {Mob}
 */
class HopperMob extends Mob {

    /**
     * The Hopper Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Hopper";
        this.slogan    = "Jumping all around";
        this.text      = "This mob can jump throught diagonal spaces in between towers.";
        this.color     = "rgb(195, 60, 195)";

        this.interval  = 600;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 1;
        this.baseSpeed = 2;
        this.money     = 1;
        this.defense   = 0;
        this.isHopper  = true;
        this.content   = `<div class="hopperMob"></div>`;

        this.minHopTime = 300;
        this.maxHopTime = 600;

        this.init(data);
    }



    /**
     * Allows this mob to jump through small gaps in the layout
     * @param {Number}  time
     * @param {Boolean} newCell
     * @param {Boolean} turned
     * @returns {Void}
     */
    specialPower(time, newCell, turned) {
        this.timer += time;
        if (this.timer > this.minHopTime && this.timer < this.maxHopTime) {
            this.actualSpeed = 0;
        } else if (this.timer > this.maxHopTime) {
            this.actualSpeed = this.speed;
            this.timer = 0;
        }
    }
}
