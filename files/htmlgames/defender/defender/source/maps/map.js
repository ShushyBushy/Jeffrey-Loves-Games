/**
 * The Map Class
 */
class Map {

    /**
     * The Map Class
     * @param {String} gameMap
     */
    constructor(gameMap) {
        this.mapData = MapsData.maps[gameMap];
        this.storage = new Storage(`defender.maps.${gameMap}`);
    }

    /**
     * Returns the amount of paths in the current map
     * @returns {Number}
     */
    getPathsAmount() {
        return this.mapData.paths;
    }

    /**
     * Returns the value in the map matrix at the given position
     * @param {Number} row
     * @param {Number} col
     * @returns {Number}
     */
    getMatrixXY(row, col) {
        return this.mapData.matrix[row][col];
    }



    /**
     * Returns true if the given value is equal to the start 1 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isStart1(value) {
        return value === MapsData.start1;
    }

    /**
     * Returns true if the given value is equal to the start 2 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isStart2(value) {
        return value === MapsData.start2;
    }

    /**
     * Returns true if the given value is equal to the target 1 or 2 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isTarget(value) {
        return value === MapsData.target1 || value === MapsData.target2;
    }

    /**
     * Returns true if the given value is equal to the target 1 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isTarget1(value) {
        return value === MapsData.target1;
    }

    /**
     * Returns true if the given value is equal to the target 2 value
     * @param {Number} value
     * @returns {Boolean}
     */
    isTarget2(value) {
        return value === MapsData.target2;
    }



    /**
     * Returns all the map Walls
     * @returns {Array.<Object>}
     */
    getWalls() {
        const walls  = [ null ];
        const matrix = [];
        let   className;

        for (let i = 0; i < this.mapData.matrix.length; i += 1) {
            matrix[i] = [];
            for (let j = 0; j < this.mapData.matrix[i].length; j += 1) {
                switch (this.mapData.matrix[i][j]) {
                case MapsData.start1:
                case MapsData.start2:
                    className = "start";
                    break;
                case MapsData.target1:
                case MapsData.target2:
                    className = "target";
                    break;
                case MapsData.wall:
                    className = "wall";
                    break;
                default:
                    className = null;
                }

                if (className) {
                    this.processWall(walls, matrix, i, j, className);
                }
            }
        }
        this.compressWalls(walls);
        return walls;
    }

    /**
     * Process the walls to reduce the amount of diva
     * @param {Array.<Object>}         walls
     * @param {Array.<Array.<Number>>} matrix
     * @param {Number}                 i
     * @param {Number}                 j
     * @param {String}                 cl
     * @returns {Void}
     */
    processWall(walls, matrix, i, j, cl) {
        let id, type;
        if (this.expandHorizontal(walls, matrix, i, j, cl)) {
            id   = matrix[i - 1][j];
            type = "horizontal";
        } else if (this.expandVertical(walls, matrix, i, j, cl)) {
            id   = matrix[i][j - 1];
            type = "vertical";
        }

        if (type) {
            if (!walls[id].type) {
                walls[id].type = type;
            }
            if (walls[id].type === "horizontal") {
                walls[id].height += 1;
            }
            if (walls[id].type === "vertical") {
                walls[id].width += 1;
            }
            matrix[i][j] = id;

        } else {
            walls.push({
                cl:     cl,
                type:   null,
                top:    i,
                left:   j,
                width:  1,
                height: 1
            });
            matrix[i][j] = walls.length - 1;
        }
    }

    /**
     * Process the walls to reduce the amount of diva
     * @param {Array.<Object>} walls
     * @returns {Void}
     */
    compressWalls(walls) {
        for (let i = 1; i < walls.length; i += 1) {
            let j;
            for (j = 1; j < walls.length; j += 1) {
                if (this.canIncreaseHeight(walls[i], walls[j])) {
                    walls[i].height += walls[j].height;
                    walls.splice(j, 1);
                    j -= 1;

                } else if (this.canIncreaseWidth(walls[i], walls[j])) {
                    walls[i].width += walls[j].width;
                    walls.splice(j, 1);
                    j -= 1;
                }
            }
        }
    }



    /**
     * Expands a Wall Horizontally
     * @param {Array.<Object>}         walls
     * @param {Array.<Array.<Number>>} matrix
     * @param {Number}                 i
     * @param {Number}                 j
     * @param {String}                 cl
     * @returns {Boolean}
     */
    expandHorizontal(walls, matrix, i, j, cl) {
        if (matrix[i - 1]) {
            const id = matrix[i - 1][j];
            return id && (!walls[id].type || walls[id].type === "horizontal") && walls[id].cl === cl;
        }
        return false;
    }

    /**
     * Expands a Wall Vertically
     * @param {Array.<Object>} walls
     * @param {Array.<Array.<Number>>} matrix
     * @param {Number} i
     * @param {Number} j
     * @param {String} cl
     * @returns {Boolean}
     */
    expandVertical(walls, matrix, i, j, cl) {
        const id = matrix[i][j - 1];
        return id && (!walls[id].type || walls[id].type === "vertical") && walls[id].cl === cl;
    }

    /**
     * Checks if it can increase the height of the wall
     * @param {Array.<Object>} w1
     * @param {Array.<Object>} w2
     * @returns {Boolean}
     */
    canIncreaseHeight(w1, w2) {
        return w1.cl === w2.cl && w1.width === w2.width && w1.left === w2.left && w1.top + w1.height === w2.top;
    }

    /**
     * Checks if it can increase the width of the wall
     * @param {Array.<Object>} w1
     * @param {Array.<Object>} w2
     * @returns {Boolean}
     */
    canIncreaseWidth(w1, w2) {
        return w1.cl === w2.cl && w1.height === w2.height && w1.top === w2.top && w1.left + w1.width === w2.left;
    }



    /**
     * Returns the Towers that will be built when starting this map
     * @returns {Array.<{type: String, col: Number, row: Number, level: Number}>}
     */
    getInitialSetup() {
        const amount = this.storage.get("towers");
        const list   = [];

        if (amount) {
            for (let i = MapsData.towerStart; i <= amount; i += 1) {
                const data = this.storage.get(`tower.${i}`);
                if (data) {
                    this.storage.remove(`tower.${i}`);
                    list.push(data);
                }
            }
        }
        return list;
    }

    /**
     * Saves a the given Tower in the map storage for the initial setup
     * @param {Tower} tower
     * @returns {Void}
     */
    buildTower(tower) {
        this.storage.set(`tower.${tower.id}`, {
            type  : tower.type,
            row   : tower.row,
            col   : tower.col,
            level : tower.level,
        });
        this.storage.set("towers", tower.id);
    }

    /**
     * Upgrades the level of the given Tower in the map storage for the initial setup
     * @param {Tower} tower
     * @returns {Void}
     */
    upgradeTower(tower) {
        const data = this.storage.get(`tower.${tower.id}`);
        if (data) {
            data.level = tower.level;
            this.storage.set(`tower.${tower.id}`, data);
        }
    }

    /**
     * Removes the given Tower from the map storage for the initial setup
     * @param {Tower} tower
     * @returns {Void}
     */
    sellTower(tower) {
        this.storage.remove(`tower.${tower.id}`);
    }
}
