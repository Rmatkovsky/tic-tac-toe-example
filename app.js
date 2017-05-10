class App {
    constructor() {
        this.config = {
            size: 5,
            symbol: {
                user: 'X',
                comp: 'O'
            }
        };
        this.rulsOfWin = [
            '*,x',
            'x,*',
            'x,x'
        ];
        this.results = {
            user: [],
            comp: [],
        };
        this.numbersIsExist = [];
        this.cells = [];
        this.status = 'play';
        this.who = 'user';
        this.elInfo = document.getElementById('info');

        this.run();
    }

    run() {
        for(let i = 0; i < this.config.size; i++) {
            this.cells[i] = [];
            for(let j = 0; j < this.config.size; j++) {
                this.cells[i][j] = new Cell(`${i},${j}`);
                this.numbersIsExist.push(`${i},${j}`);
            }
        }
        this.update();
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    setWho(who) {
        this.who = who;
    }

    getWho() {
        return this.who;
    }

    updateInfo() {
        if(this.getStatus() === 'win') {
            let text = this.getWho() === 'comp' ? 'You lost!' : 'You win!'

            this.elInfo.innerHTML = `<h3>${text}</h3>`;
        } else {
            this.elInfo.innerHTML = `<h3>${this.getStatus()}</h3>`;
        }
    }

    update() {
        this.isWin();
        this.updateInfo();

        if( this.getStatus() === 'wait' ) {
            let time = (Math.floor(Math.random() * (3 - 1)) + 1) * 1000;
            setTimeout(this.stepByComp.bind(this), 1);
        }
    }

    stepByComp() {
        if(!this.getAvailableCell()) {
            return false;
        }

        let freeCell = this.getAvailableCell();
        let freeCellSplit = freeCell.split(',')

        this.results.comp.push(freeCell);
        this.cells[freeCellSplit[0]][freeCellSplit[1]].setChecked();
        this.removeAvailableCell(this.cells[freeCellSplit[0]][freeCellSplit[1]].coords);
        this.setStatus('play');
        this.update();
        this.setWho('user');
    }

    isWin() {
        let array = this.results[this.getWho()];

        if(array.length >= this.config.size) {
            array.sort();
            for(let i = 0; i < array.length; i++) {
                if(this.searchWinValues(array[i])) {
                    break;
                };
            }
        }
    }

    searchWinValues(value) {
        let result = false;

        for(let i = 0; i < this.rulsOfWin.length; i++) {
            if(this.generateVariantForWin(value, this.rulsOfWin[i])) {
                let valueSplit = value.split(',');

                this.cells[valueSplit[0]][valueSplit[1]].setWin();
                result = true;
                break;
            }
        }

        return result;
    }

    generateVariantForWin(value, ruls, count = 1, down = false) {
        let rulsSplit = ruls.split(',');
        let valueSplit = value.split(',');

        if( count >= this.config.size) {
            this.setStatus('win');
            return true;
        }

        if(rulsSplit[0] === 'x' && rulsSplit[1] === 'x') {
            if(((valueSplit[0]) == 0 && (~~valueSplit[1] + 1) == this.config.size) || down) {
                valueSplit[0]++;
                valueSplit[1]--;
                down = true;
            } else {
                valueSplit[0]++;
                valueSplit[1]++
            }
            
        } else if(rulsSplit[0] === 'x') {
            valueSplit[0]++;
        } else {
            valueSplit[1]++;
        }

        let newValue = valueSplit.join(',');

        if(this.results[this.getWho()].indexOf(newValue) !== -1 && this.generateVariantForWin(newValue, ruls, ++count, down)) {
            this.cells[valueSplit[0]][valueSplit[1]].setWin();
            return true;
        }
    }

    getAvailableCell() {
        let index = Math.floor(Math.random() * (this.numbersIsExist.length - 0)) + 0;
        return this.numbersIsExist[index];
    }

    removeAvailableCell(value) {
        let index = this.numbersIsExist.indexOf(value);
        this.numbersIsExist.splice(index, 1);
    }
}

class Cell {
    constructor(coords) {
        this.coords = coords;
        this.checked = false;
        this.type = null;
        this.el = document.createElement('div');

        this.render();
    }

    setChecked() {
        this.checked = true;
        this.el.style.background = '#cccccc';
        this.update();
    }

    setWin() {
        this.el.style.background = '#cdf7cd';
    }

    update() {
        let symbol = app.config.symbol[app.getWho()];
        this.el.innerText = symbol;
    }

    handlerClick(self) {
        if(self.checked || app.getStatus() != 'play') {
            return false;
        }

        self.setChecked();

        app.setStatus('wait');
        app.results.user.push(self.coords);
        app.removeAvailableCell(self.coords);
        app.isWin();
        app.update();
        app.setWho('comp');

        this.removeEventListener('click', self.handlerClick);
    }

    render() {
        var self = this;
        this.el.className = 'item';
        this.el.addEventListener('click', function(e) {
            self.handlerClick.call(this, self);
        });
        (document.getElementById('table')).append(this.el);
    }
}

let app = new App();