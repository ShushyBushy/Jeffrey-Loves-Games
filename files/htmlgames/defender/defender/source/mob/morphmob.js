/**
 * The Morph Mob Class
 * @extends {Mob}
 */
class MorphMob extends Mob {

    /**
     * The Morph Mob constructor
     * @param {Object} data
     */
    constructor(data) {
        super();

        this.name      = "Morph";
        this.slogan    = "Cannot decide";
        this.text      = "They change of type after a few seconds";
        this.color     = "rgb(0, 128, 128)";

        this.interval  = 400;
        this.amount    = 10;
        this.bosses    = 1;
        this.lifeMult  = 1;
        this.baseSpeed = 1;
        this.money     = 1;
        this.defense   = 0;
        this.morph     = [ "Normal", "Dark", "Inmune", "Fast" ];
        this.content   = `<div class="normalMob"></div>`;

        this.morphTime = 5000;

        this.init(data);
    }



    /**
     * Changes the type of the Mob, after some time
     * @param {Number}  time
     * @param {Boolean} newCell
     * @param {Boolean} turned
     * @returns {Void}
     */
    specialPower(time, newCell, turned) {
        this.timer += time;
        if (this.timer > this.morphTime) {
            this.counter     = (this.counter + 1) % this.morph.length;
            this.type        = this.morph[this.counter];
            const mob        = Mob.create(this.type, {});
            this.actualSpeed = mob.speed;
            this.isInmune    = !!mob.isInmune;
            this.defense     = mob.defense || 0;
            this.timer       = 0;

            this.mbody.innerHTML = mob.content;
        }
    }
}
