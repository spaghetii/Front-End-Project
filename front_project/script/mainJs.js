class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y)
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y)
    }
    mul(s) {
        return new Vector(this.x * s, this.y * s)
    }
    set(x, y) {
        this.x = x
        this.y = y
        return this
    }
    isEqualTo(v) {
        return this.x === v.x && this.y === v.y
    }
}

class Snake {
    constructor() {
        this.body = []
        // 目前長度
        this.maxLength = 5
        this.head = new Vector()
        // 方向
        this.direction = new Vector(1, 0)
        this.color = [];
    }

    update() {

        let newHead = this.head.add(this.direction);
        // 防Timer反應不過來
        if (this.body.length - 1 > 0)
            if (newHead.isEqualTo(this.body[this.body.length - 1])) {
                this.direction = this.direction.mul(-1);
                newHead = this.head.add(this.direction);
            }
        this.body.push(this.head)
        this.head = newHead
        // 如果身體長度大於目前最大長度
        while (this.body.length > this.maxLength) {
            this.body.shift()
        }
    }
    // 選擇方向 

    setDirection(dir) {
        let target;
        switch (dir) {
            case 'up':
                target = new Vector(0, -1)
                break
            case 'down':
                target = new Vector(0, 1)
                break
            case 'left':
                target = new Vector(-1, 0)
                break
            case 'right':
                target = new Vector(1, 0)
                break
            default:
                break
        }

        // 如果target沒被定義 或是玩家按下了目前行進方向的相反鍵
        if (!target || target.isEqualTo(this.direction.mul(-1))) {
            // do nothing
        } else {
            this.direction = target
        }
    }
    // 偵測邊界
    checkBoundary(xMin, yMin, xMax, yMax) {
        const xInRange = this.head.x >= xMin && this.head.x < xMax
        const yInRange = this.head.y >= yMin && this.head.y < yMax
        return xInRange && yInRange
    }
}

class Game {
    constructor() {
        this.start = false
        this.mode = false
        this.boxSize = 12
        this.boxMargin = 2
        this.horiBoxesIni = 0
        this.vertiBoxesIni = 0
        this.horiBoxes = 71
        this.vertiBoxes = 43
        this.snake = null
        this.foods = []
        this.wall = []
        this.time = 150
        this.BGMVolume = 0.1
        this.SEVolume = 1
    }
    getBoxLocation(x, y) {
        //取得目前在哪個位置(格子長度+格子與格子之間的邊界)
        return new Vector(
            x * this.boxSize + (x - 1) * this.boxMargin,
            y * this.boxSize + (y - 1) * this.boxMargin
        )
    }
    //把選到的格子畫顏色
    drawBox(v, color) {
        this.ctx.fillStyle = color
        const boxLocation = this.getBoxLocation(v.x, v.y)
        this.ctx.fillRect(boxLocation.x, boxLocation.y, this.boxSize, this.boxSize)
    }
    //畫食物產出特效
    drawFoodEffect(x, y) {
        const rMin = 2
        const rMax = 100
        let r = rMin
        const position = this.getBoxLocation(x, y)
        const _this = this
        const effect = function () {
            r > rMax ? r = 0 : r += 5;
            _this.ctx.lineWidth = 5;
            _this.ctx.strokeStyle = `rgba(255,0,0, ${r%2})`
            _this.ctx.beginPath()
            _this.ctx.arc(position.x + _this.boxSize / 2, position.y + _this.boxSize / 2, r, 0, Math
                .PI * 2)
            _this.ctx.stroke()
            if (r < rMax) {
                requestAnimationFrame(effect)
            } else {
                cancelAnimationFrame(effect)
            }
        }
        requestAnimationFrame(effect)
    }
    //initial
    init() {
        $("#panel").fadeOut(0).css("opacity", "1");
        this.canvas = document.getElementById('level')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = this.boxSize * this.horiBoxes + this.boxMargin * (this.horiBoxes - 1)
        this.canvas.height = this.boxSize * this.vertiBoxes + this.boxMargin * (this.vertiBoxes - 1)
        this.snake = new Snake()
        this.render()
        this.update()
        this.getScore();
        if (localStorage["BGM"]) {
            document.getElementById("bgAudio").volume = localStorage["BGM"];
            $("#BGM").prop("value", (localStorage["BGM"] * 100).toString());
        } else {
            document.getElementById("bgAudio").volume = this.BGMVolume;
            $("#BGM").prop("value", (this.BGMVolume * 100).toString());

        }
        if (localStorage["SE"]) {
            document.getElementsByClassName("soundEffect").volume = localStorage["SE"];
            $("#SE").prop("value", (localStorage["SE"] * 100).toString());
        } else {
            document.getElementsByClassName("soundEffect").volume = this.SEVolume;
            $("#SE").prop("value", (this.SEVolume * 100).toString());
        }

    }

    startGame() {
        if (!this.start) {
            this.start = true
            this.horiBoxesIni = 0
            this.vertiBoxesIni = 0
            this.horiBoxes = 71
            this.vertiBoxes = 43
            this.time = 150
            this.snake = new Snake()
            this.createFood()
            $("#panel").finish();
            $("#panel").fadeOut(10);
            this.getScore();
        }
    }

    endGame() {
        this.start = false;
        this.foods.length = 0;
        $("#panel").fadeIn(3000);
        document.getElementById("bgAudio").pause();
        document.getElementById("bgAudio").currentTime = 0;
        document.getElementById("final").play();
    }

    createFood() {
        this.snake.color = location.search.replace("?", "").split("&");
        this.mode = this.snake.color[3]
        let x, y;
        if (this.mode == "true") {
            x = parseInt(Math.random() * (this.horiBoxes - this.horiBoxesIni - 2) + this
                .horiBoxesIni + 1,
                10)
            y = parseInt(Math.random() * (this.vertiBoxes - this.vertiBoxesIni - 2) + this
                .vertiBoxesIni +
                1, 10)
        } else {
            x = parseInt(Math.random() * this.horiBoxes, 10)
            y = parseInt(Math.random() * this.vertiBoxes, 10)
        }

        console.log(x + "," + y)
        this.drawFoodEffect(x, y)
        this.foods.push(new Vector(x, y))
    }

    render() {
        this.ctx.fillStyle = 'rgba(0,0,0,1)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        for (let x = this.horiBoxesIni; x < this.horiBoxes; x += 1) {
            for (let y = this.vertiBoxesIni; y < this.vertiBoxes; y += 1) {
                this.drawBox(new Vector(x, y), 'rgba(255,255,255,0.2)')
            }
        }
        this.foods.forEach((p) => {
            this.drawBox(p, 'red')
        })
        this.snake.color = location.search.replace("?", "").split("&");
        this.snake.body.forEach((boxPos, i) => {
            if (i == 0) //tail
                this.drawBox(boxPos, this.snake.color[2])
            else if (i == this.snake.body.length - 1) //head
                this.drawBox(boxPos, this.snake.color[0])
            else
                this.drawBox(boxPos, this.snake.color[1])
        })

        requestAnimationFrame(() => {
            this.render()
        })
    }

    update() {
        this.snake.color = location.search.replace("?", "").split("&");
        this.mode = this.snake.color[3]
        if (this.start) {
            // this.playSound('A2', -20)
            this.snake.update()
            this.foods.forEach((food, i) => {
                if (this.snake.head.isEqualTo(food)) {
                    this.snake.maxLength += 1
                    this.foods.splice(i, 1) //把食物清除
                    document.getElementById("eatFood").play();
                    if (this.time > 100) {
                        this.time -= 10;
                        if (this.mode == "true") {
                            this.horiBoxes -= 1;
                            this.vertiBoxes -= 1;
                            this.horiBoxesIni += 1;
                            this.vertiBoxesIni += 1;
                        }
                    } else if (this.time > 70) {
                        this.time -= 5;
                        if (this.mode == "true") {
                            this.horiBoxes -= 1;
                            this.vertiBoxes -= 1;
                            this.horiBoxesIni += 1;
                            this.vertiBoxesIni += 1;
                        }
                    } else if (this.time > 45) this.time -= 3;
                    else if (this.time > 10) this.time -= 1;

                    this.getScore();
                    this.createFood();
                }
            })

            if (!this.snake.checkBoundary(this.horiBoxesIni, this.vertiBoxesIni, this.horiBoxes, this
                    .vertiBoxes)) {
                console.log('撞牆ㄌ')
                this.endGame()
            }
            this.snake.body.forEach((body, i) => {
                if (this.snake.head.isEqualTo(body)) {
                    console.log('吃到自己');
                    this.endGame();
                }
            })
        }
        setTimeout(() => {
            this.update();
        }, this.time);
    }

    getScore() {
        let uni = 0,
            ten = 0,
            hun = 0;
        hun = Math.floor((this.snake.maxLength - 5) / 100);
        ten = Math.floor((this.snake.maxLength - 5) / 10);
        uni = (this.snake.maxLength - 5) % 10;
        let imgSrc_uni = "<img src = 'img/number/" + uni + ".png'> ";
        let imgSrc_ten = "<img src = 'img/number/" + ten + ".png'> ";
        let imgSrc_hun = "<img src = 'img/number/" + hun + ".png'> ";
        let name = '<img src="img/score.png" id = "scoreName"><br>';
        $("#score").html(name + imgSrc_uni + imgSrc_ten + imgSrc_hun);
        $("#score img:not(:first-child)").css("height", "45px").css("width", "30px").css("float", "right");
    }
}

function handleLoad() {
    const game = new Game();
    var setPause = false;
    game.init();

    $(document).keydown((e) => {
        e.preventDefault();
        const dir = e.key.replace('Arrow', '').toLowerCase()
        game.snake.setDirection(dir)
    });

    $('#start-game').click(() => {
        game.startGame();
    }).mousedown(() => {
        $("#start-game").prop("src", "img/start_btn_hover.png");
        document.getElementById("bgAudio").play();
        // music.pause();
    }).mouseup(() => {
        $("#start-game").prop("src", "img/start_btn.png");
    }).mouseout(() => {
        $("#start-game").prop("src", "img/start_btn.png");
    });
    $("#box [type=range]").on("input", function () {
        if ($(this).prop("id") == "BGM") {
            document.getElementById("bgAudio").volume = parseInt($(this).val()) / 100;
            localStorage.setItem("BGM", parseInt($(this).val()) / 100);
        }
        if ($(this).prop("id") == "SE") {
            document.getElementsByClassName("soundEffect").volume = parseInt($(this).val()) / 100;
            localStorage.setItem("SE", parseInt($(this).val()) / 100);
        }

    })
    $("#setting").mouseenter(() => {
        flag = setInterval((() => {
            let deg = 0;
            return () => {
                deg += 10;
                $("#setting").css("transform", `rotateZ(${deg}deg)`);
            }
        })(), 100);
    }).click(function () {
        $("#box").css("top", "50%");
        if (!game.start) setPause = false;
        else setPause = true;
        game.start = false;
    });
    //全螢幕
    $("#full_or_window").click(function () {
        if ($("#full_or_window").prop("checked")) {
            document.getElementById("menu_div").requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    //返回設定
    $("#option_box_back").click(function () {
        $("#box").css("top", "-50%");
        if (setPause) game.start = true;
        event.cancelBubble = true;
    });
    $("#question").click(() => {

        $("#tip").fadeIn(1000).fadeOut(5000);
    });

    $("#question").mouseenter(() => {
        flag = setInterval((() => {
            let deg = 0;
            let dif = 20;
            return () => {
                deg += dif;
                $("#question").css("transform", `rotateZ(${deg}deg)`);
                if (deg > 30 || deg < -30) dif *= -1;
            }
        })(), 100);
    });

    $("#controll img").mouseleave(() => {
        $("#setting").css("transform", `rotateZ(0deg)`);
        $("#question").css("transform", `rotateZ(0deg)`);
        clearInterval(flag);
    });

}

window.addEventListener('load', handleLoad);