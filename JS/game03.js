window.onload = init;

var canvas;
var ctx;
var stuff = [];
var thingInMotion; // 드래그할 대상

// 친구와 나의 접시입니다.
var dish_friend;
var dish_me;

// 접시 위에 올려진 오이의 갯수를 구합니다.
var friend = 0;
var mine = 0;
var exept; // 기본 객체

// 오이의 갯수
var count;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // 접시들을 만듭니다.
    dish_friend = new Dishes(200, 475, "rgb(232, 234, 112)", "rgb(124, 135, 52)");
    dish_me = new Dishes(600, 475, "#ffffff", "rgb(40, 122, 142)");
    stuff.push(dish_friend);
    stuff.push(dish_me);
    exept = stuff.length; // 기본 요소의 갯수 : 2

    var random_x, random_y;

    random = Math.random()*10+1; // 오이의 갯수 : 랜덤으로 구합니다.
    for(var i=0; i<random; i++){
        random_x = Math.random()*700+50;
        random_y = Math.random()*225+50;
        stuff.push(new Cucumber(random_x, random_y));
    }

    drawStuff();
    
    // 총 오이의 갯수
    count = Math.floor(random)+1;
    document.getElementById("count").innerHTML = count +" 개";

    // 마우스를 누르는 동안
    canvas.addEventListener("mousedown", startDrag, false);
} // init

// 오이를 그립니다.
function Cucumber(x, y){
    this.x = x;
    this.y = y;
    this.r = 40;

    //오버라이딩
    this.draw = function drawCircle() { //오버라이딩 (this.drawCircle = function())
        ctx.fillStyle = "#BDDEAB";
        ctx.beginPath(); //원은 패스 (한덩어리) - 패스시작
        ctx.arc(this.x,this.y,40,0,Math.PI*2.0, true);
        
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#80B578";
        
        ctx.fill();
        ctx.stroke();//
        ctx.closePath(); //패스 끝

        // 가운데 동그라미,,
        ctx.fillStyle = "#CCEFC5";
        ctx.beginPath(); //원은 패스 (한덩어리) - 패스시작
        ctx.arc(this.x,this.y,15,0,Math.PI*2.0, true);

        ctx.lineWidth = 5;
        ctx.strokeStyle = "#BDDEAB";
        
        ctx.fill();
        ctx.stroke();//
        ctx.closePath(); //패스 끝
    }

    this.overCheck = function overCircle(mx,my) {
        //(x,y)에서 마우스 지점까지의 거리
        if(Math.pow((mx-this.x),2)+Math.pow((my-this.y),2) <= Math.pow(this.r, 2))
            return true;
        return false;
    }
}

// 접시를 그립니다.
function Dishes(x, y, color, strokeColor) {
    this.x = x;
    this.y = y;
    this.r = 125;
    this.color = color;

    //오버라이딩
    this.draw = function drawCircle() { //오버라이딩 (this.drawCircle = function())
        ctx.fillStyle = this.color;
        ctx.beginPath(); //원은 패스 (한덩어리) - 패스시작
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2.0, true);
        
        ctx.lineWidth = 5;
        ctx.strokeStyle = strokeColor;
        
        ctx.fill();
        ctx.stroke();//
        ctx.closePath(); //패스 끝

        // 가운데 동그라미,,
        ctx.fillStyle = this.color;
        ctx.beginPath(); //원은 패스 (한덩어리) - 패스시작
        ctx.arc(this.x,this.y,(this.r-30),0,Math.PI*2.0, true);
        
        ctx.lineWidth = 5;
        ctx.strokeStyle = strokeColor;
        
        ctx.fill();
        ctx.stroke();//
        ctx.closePath(); //패스 끝
    }

    this.overCheck = function overCircle(mx,my) {
        //(x,y)에서 마우스 지점까지의 거리
        if(Math.pow((mx-this.x),2)+Math.pow((my-this.y),2) <= Math.pow(125, 2))
            return true;
        return false;
    }
}

// 나중에 지우기**
//객체를 캔버스에 지우기 -> 그리기
function drawStuff() {
    ctx.clearRect(0,0,800,600); //깨끗하게~
    ctx.strokeStyle = "rgb(169, 209, 142)"; //선 색상
    ctx.lineWidth = "1px"; // canvas 선 크기
    ctx.strokeRect(0,0,800,600);
    for(i = 0; i<stuff.length; i++) {
        stuff[i].draw();
    }
}
//캔버스의 기본원리: 매번 새로그린다~ 모두다~

function startDrag(e) {
    mx = e.offsetX;
    my = e.offsetY;
    for(i=exept; i<stuff.length; i++){
        if(stuff[i].overCheck(mx, my) == true){
            // 선택이 되면 offset을 저장함
            // 일정한 간격 유지 offset저장
            diffx = mx - stuff[i].x; // 마우스와 도형의 거리 유지
            diffy = my - stuff[i].y;
            // 누구를 moveit할지 moveit함수에게 알려주자!
            var item = stuff[i];
            thingInMotion = stuff.length-1;// 배열의 마지막 인자값
            stuff.splice(i, 1);
            stuff.push(item);

            // mousemove => 따라가기 함수 실행
            canvas.addEventListener("mousemove", moveit, false);
            // mouseup => 도형을 canvas에 떨어뜨림
            canvas.addEventListener("mouseup", dropit, false);
        }
    }
}

function moveit(e){
    mx = e.offsetX;
    my = e.offsetY;
    stuff[thingInMotion].x = mx - diffx;
    stuff[thingInMotion].y = my - diffy;
    drawStuff();
}

function dropit(e){
    canvas.removeEventListener("mousemove", moveit, false); // 이벤트 제거
    inDish();
    canvas.removeEventListener("mouseup", dropit, false); // 이벤트 제거
}

// 움직일때마다 반복해서 확인
function inDish() {
    mine=0;
    friend=0;
    for(var i=exept; i<stuff.length; i++){
        
        if(dish_friend.overCheck(stuff[i].x, stuff[i].y))
            friend ++;
        else if(dish_me.overCheck(stuff[i].x, stuff[i].y))
            mine ++;
    }
    document.getElementById("friend_cucumber").innerHTML = friend+" 개";
    document.getElementById("mine_cucumber").innerHTML = mine+" 개";
}

function decision() {
    if(mine == count)
        alert("친구 반응 : 나는 안줄거야?")
    else if(friend>=mine)
        alert("친구 반응 : 잘먹을게!");
    else if(friend<mine)
        alert("친구 반응 : 음.. 네가 더 많은것 같네..?^^");
}