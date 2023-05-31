(function () {
    "use strict";

    let display, score, maps, board, panel, towers, mobs, sounds,
        audio, animation, startTime, actions, shortcuts;

    let gameMap   = "classic";
    let gameLevel = 0;



    /**
     * Request an animation frame
     * @returns {Void}
     */
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = window.requestAnimationFrame(() => {
            const time  = new Date().getTime() - startTime;
            const speed = time / 16;
            const dec   = score.decTimer(time);

            towers.animate(time, speed);
            mobs.animate(time, speed, dec);

            if (display.isPlaying) {
                requestAnimation();
            }
        });
    }

    /**
     * Cancel an animation frame
     * @returns {Void}
     */
    function cancelAnimation() {
        window.cancelAnimationFrame(animation);
    }



    /**
     * Destroys the Game
     * @returns {Void}
     */
    function destroyGame() {
        cancelAnimation();
        board.destroy();
        towers.destroy();
    }

    /**
     * Shows the Game Over Screen
     * @returns {Void}
     */
    function showGameOver() {
        display.set("gameOver");
        destroyGame();
        maps.saveScore(score.lives, score.total);
        score.showFinal();
    }



    /**
     * Starts a new Game
     * @param {Number} level
     * @returns {Void}
     */
    function newGame(level) {
        display.set("planning");
        gameLevel = level;

        maps.saveMap(gameMap, gameLevel);

        score  = new Score(gameLevel, showGameOver);
        board  = new Board(gameMap);
        panel  = new Panel();
        mobs   = new Mobs(score, board, panel, sounds, gameLevel);
        towers = new Towers(score, board, panel, mobs, sounds);
    }

    /**
     * Show the Main Screen
     * @returns {Void}
     */
    function showMainScreen() {
        display.set("mainScreen");
    }

    /**
     * Shows the Maps selection Screen
     * @returns {Void}
     */
    function showMapSelection() {
        display.set("selectMap");
        maps.display();
    }

    /**
     * Play the last played Map
     * @returns {Void}
     */
    function showLastMap() {
        gameMap = maps.map || gameMap;
        newGame(maps.level || gameLevel);
    }

    /**
     * Shows the Level Selection Screen
     * @param {String} map
     * @returns {Void}
     */
    function showLevelSelection(map) {
        display.set("selectLevel");
        gameMap = maps.codeToMap(map);
    }

    /**
     * Show the Controls
     * @returns {Void}
     */
    function showControls() {
        display.set("controls");
    }



    /**
     * Start Playing
     * @returns {Void}
     */
    function startPlaying() {
        display.set("playing");
        panel.gameStarted();
        board.gameStarted();
        towers.gameStarted();
        mobs.gameStarted();

        requestAnimation();
    }

    /**
     * Starts the Game and or sends the next wave
     * @returns {Void}
     */
    function nextWave() {
        if (display.isPlanning) {
            startPlaying();
        } else {
            mobs.sendNextWave();
        }
    }



    /**
     * Start the Game Again
     * @returns {Void}
     */
    function restartGame() {
        destroyGame();
        newGame(gameLevel);
    }

    /**
     * Ends the current Game
     * @returns {Void}
     */
    function endGame() {
        destroyGame();
        showMainScreen();
    }



    /**
     * Starts the pause
     * @returns {Void}
     */
    function startPause() {
        display.setPause();
        cancelAnimation();
    }

    /**
     * Pause the Game
     * @returns {Void}
     */
    function pauseGame() {
        if (display.isPlanningPaused) {
            display.set("planning");
        } else if (display.isPlayingPaused) {
            display.set("playing");
            requestAnimation();
        } else {
            display.setPause();
            towers.drop();
            cancelAnimation();
        }
    }



    /**
     * Toggles the sound on and off
     * @returns {Void}
     */
    function toggleSound() {
        sounds.toggle();
    }

    /**
     * Ends the tower selections and hides the descriptions
     * @returns {Void}
     */
    function endSelection() {
        towers.drop();
        panel.hide();
    }



    /**
     * Creates an actions object
     * @returns {Void}
     */
    function createActions() {
        actions = {
            mainScreen  : ()  => showMainScreen(),
            selectMap   : ()  => showMapSelection(),
            lastMap     : ()  => showLastMap(),
            controls    : ()  => showControls(),
            selectLevel : (d) => showLevelSelection(d),
            newGame     : (d) => newGame(d),
            pause       : ()  => pauseGame(),
            restart     : ()  => restartGame(),
            endGame     : ()  => endGame(),
            mute        : ()  => toggleSound(),
            next        : ()  => nextWave(),
            upgrade     : ()  => towers.upgrade(),
            fire        : ()  => towers.fire(),
            lock        : ()  => towers.lock(),
            sell        : ()  => towers.sell(),
            sellAll     : ()  => towers.sellAll()
        };
    }

    /**
     * Creates a shortcut object
     * @returns {Void}
     */
    function createShortcuts() {
        const paused = {
            P : "pause",
            C : "pause",
            R : "restart",
            Q : "endGame"
        };
        const game = {
            P        : "pause",
            M        : "mute",
            N        : "next",
            U        : "upgrade",
            F        : "fire",
            L        : "lock",
            S        : "sell",
            A        : "sellAll",
            DN       : (d) => towers.startBuilding(d),
            B        : ()  => towers.buildTower(),
            Left     : ()  => towers.moveTower(-1, 0),
            Up       : ()  => towers.moveTower(0, -1),
            Right    : ()  => towers.moveTower(1,  0),
            Down     : ()  => towers.moveTower(0,  1),
            Home     : ()  => towers.selectFirst(),
            End      : ()  => towers.selectLast(),
            Z        : ()  => towers.selectNextPrev(-1),
            X        : ()  => towers.selectNextPrev(+1),
            PageUp   : ()  => towers.selectNextPrev(-5),
            PageDown : ()  => towers.selectNextPrev(+5),
            Escape   : ()  => endSelection()
        };

        shortcuts = {
            mainScreen : {
                N : "selectMap",
                L : "lastMap",
                C : "controls",
            },
            selectMap : {
                HN        : "selectLevel",
                BackSpace : "mainScreen",
            },
            selectLevel : {
                E         : () => newGame(0),
                N         : () => newGame(1),
                H         : () => newGame(2),
                BackSpace : "selectMap",
            },
            controls : {
                BackSpace : "mainScreen",
            },
            gameOver : {
                N         : "mainScreen",
                BackSpace : "mainScreen",
            },
            planning       : game,
            playing        : game,
            planningPaused : paused,
            playingPaused  : paused
        };
    }

    /**
     * Stores the used DOM elements and initializes the Event Handlers
     * @returns {Void}
     */
    function initDomListeners() {
        const specialKeys = {
            8  : "BackSpace",
            27 : "Esc",
            33 : "PageDown",
            34 : "PageUp",
            35 : "End",
            36 : "Home",
            37 : "Left",
            38 : "Up",
            39 : "Right",
            40 : "Down",
        };

        audio = document.querySelector(".audioButton");

        document.body.addEventListener("click", (e) => {
            const element = Utils.getTarget(e);
            if (actions[element.dataset.action]) {
                actions[element.dataset.action](element.dataset.data || undefined);
                e.preventDefault();
            }
        });

        document.addEventListener("keydown", (e) => {
            const key    = e.keyCode;
            const number = KeyCode.keyToNumber(key);
            const hexa   = KeyCode.keyToHexa(key);
            let   code   = KeyCode.keyToCode(key);
            let   data   = code;

            if (shortcuts[display.get()].HN && hexa !== null) {
                code = "HN";
                data = hexa;
            } else if (shortcuts[display.get()].DN && number !== null) {
                code = "DN";
                data = dec;
            }

            if (shortcuts[display.get()][code]) {
                if (typeof shortcuts[display.get()][code] === "string") {
                    actions[shortcuts[display.get()][code]](data);
                } else {
                    shortcuts[display.get()][code](data);
                }
                e.preventDefault();
            }
        });
    }

    /**
     * The main Function
     * @returns {Void}
     */
    function main() {
        createActions();
        createShortcuts();
        initDomListeners();

        display = new Display();
        maps    = new Maps();
        sounds  = new Sounds([
            "build", "upgrade", "sell", "blocking", "enter", "exit", "death", "shoot", "hit",
            "fast", "missile", "antiair", "frost", "earth", "ink", "snap", "laser"
        ], "defender.sound");
    }


    // Load the game
    window.addEventListener("load", main, false);

}());
