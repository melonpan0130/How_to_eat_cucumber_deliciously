window.onload = init;

var canvas;
var ctx;
var stuff = [];
var cucum;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    cucum = new Image();
    cucum.addEventListener('load', function(){
        ctx.drawImage(cucum, 450, 30, 253, 174);
    }, false);
    cucum.src = "../img/game02_img/click2.png";

    vessel = new Image();
    vessel.addEventListener('load', function(){
        ctx.drawImage(vessel, 220, 300, 368, 280);
    }, false);
    vessel.src = "../img/game02_img/vessel_1.png";

    var cucumber = new Rect(450, 60, 253, 174, "rgba(255,255,255,0)");
    stuff.push(cucumber);
    // stuff.push(new Circle(460, 190, 20)); // 오이
    var limit = new Rect(220, 300, 368, 120, "#BDAF6C");
    stuff.push(limit);
    drawStuff();//그리기 전용 함수 - 한번에 그리기
    
    var score = document.getElementById("score");
    score.innerHTML = 0+" 개";
    
    canvas.addEventListener("click", Falling, false);
    canvas.addEventListener("onmousedown", changeImg, false);
    canvas.addEventListener("onmouseup", reChangeImg, false);
}

function Rect(x, y, width, height, color) { // 생성자 함수를 이용한 객체 선언
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    //오버라이딩
    this.draw = function drawRect() {
        ctx.fillStyle = this.color; //canvas의 api
        ctx.fillRect(this.x, this.y, this.width, this.height); //canvas의 api
    }

    //마우스 관련 이벤트 선언예정 = 마우스 좌표(mx, my)
    this.overCheck = function overRect(mx, my) {
        if((this.x <= mx && mx <= this.x+this.width) && (this.y <= my && my <= this.y + this.height)) { //this는 중요하다
            //마우스가 나를 선택함
            return true;
        } else {
            return false;
        }
    }
}

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = "rgb(169, 209, 142)";

    //오버라이딩
    this.draw = function drawCircle() { //오버라이딩 (this.drawCircle = function())
        ctx.fillStyle = this.color;
        ctx.beginPath(); //원은 패스 (한덩어리) - 패스시작
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2.0, true);
            ctx.lineWidth = 5; // 오이 껍질
            ctx.strokeStyle = "rgb(84, 130, 53)";
            ctx.fill();
            ctx.stroke();
        ctx.closePath(); //패스 끝
    }

    this.overCheck = function overCircle(mx,my) {
        //(x,y)에서 마우스 지점까지의 거리
        if(Math.pow((mx-this.x),2)+Math.pow((my-this.y),2) <= Math.pow(this.r, 2))
            return true;
        return false;
    }
} // circle

var cucum_trigger = false;
//객체를 캔버스에 지우기 -> 그리기
function drawStuff() {
    ctx.clearRect(0,0,800,600); //깨끗하게~
    ctx.strokeStyle = "rgb(169, 209, 142)";  // canvas의 선
    ctx.lineWidth = "1px";
    ctx.strokeRect(0,0,800,600);
    cucum.src = "../img/game02_img/click.png";
    vessel.src = "../img/game02_img/vessel_1.png";

    for(var i = 0; i<stuff.length; i++) {
        stuff[i].draw();
    }
}

// timer는 한번만 실행
var timer_once = 1; 
function Falling(e){
    
    mx = e.offsetX;
    my = e.offsetY;
    var item;

    // 오이의 위치와 비교한다.
    if(stuff[0].overCheck(mx, my) == true){
        if(timer_once){
            timer();
            timer_once = 0;
        }
        random_x = Math.random()*290+260;
        random_y = Math.random()*90+330;
        item = new Circle(random_x, random_y, 35);
        stuff.push(item);
        drawStuff();
    }
}

function timer(){
    console.log("this is timer");
    var running;
    var limitTime = 1000*2;
    var seconds = document.getElementById("seconds");
    running = setInterval(function() {
        limitTime --;
        seconds.innerHTML = Math.floor(limitTime/100)+":"+(limitTime%100);
        score.innerHTML = stuff.length-2+" 개";
        if(limitTime==0){
            clearInterval(running);
            alert("time over");
            alert("your score : "+(stuff.length-2));
            // window.location.href = "../HTML/games.html";
        }
    }, 1);
}// timer

function changeImg(){
    if(stuff[0].overCheck(mx, my) == true){
        cucum.src = "../img/game02_img/click2.png";
        cucum_trigger = true;
        drawStuff();
    }
}

function reChangeImg(){
    if(stuff[0].overCheck(mx, my) == true){
        cucum.src = "../img/game02_img/click.png";
        cucum_trigger = false;
        drawStuff();
    }
}