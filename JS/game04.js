window.onload = init;
var canvas;
var ctx;
var stuff = [];
var stuff_xy = []; // 이미지의 위치를 저장합니다.
var thingInMotion;
var face; // 얼굴 이미지입니다.
var left_cu;//얼굴 위에 올라갈 오이의 갯수입니다.
var random; // 오이의 총 갯수입니다.

function init() {
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');

    random = Math.random()*10*1; //  오이 갯수
    left_cu = Math.floor(random);
    document.getElementById("left").innerHTML = (left_cu+1) +" 개";
    var random_x, random_y; // 오이 위치
    for(var i=0; i<random; i++){
        random_x = Math.random()*177+23;
        random_y = Math.random()*500+23;
        stuff.push(new Sliced(random_x, random_y));
        stuff_xy[i] = new Array();
        stuff_xy[i][0] = random_x;
        stuff_xy[i][1] = random_y;
    }

    canvas.addEventListener("mousedown", DragImage, false);
}

function Sliced(x, y) {
    var sliced = new Image();

    sliced.onload = function() {
        ctx.drawImage(sliced, x, y, 46, 75);
    }
    sliced.src = "../img/game04_img/slices.png";
    
    return sliced;
}

function DragImage(e) {
    mx = e.offsetX;
    my = e.offsetY;
    for(i=0; i<stuff.length; i++){
        if(stuff_xy[i][0]<=mx && mx<=stuff_xy[i][0]+46
            && stuff_xy[i][1]<=my && my<=stuff_xy[i][1]+75){
            // 해당 오이를 선택함
            diffx = mx - stuff_xy[i][0]; // 마우스와 도형의 거리 유지
            diffy = my - stuff_xy[i][1];

            // 누구를 moveit할지 moveit함수에게 알려주자!
            var item = stuff[i];
            var itemx = stuff_xy[i][0];
            var itemy = stuff_xy[i][1];
            thingInMotion = stuff.length-1;// 배열의 마지막 인자값
            stuff.splice(i, 1);
            stuff_xy.splice(i, 1);
            stuff.push(item);
            stuff_xy[thingInMotion] = new Array();
            stuff_xy[thingInMotion][0] = itemx;
            stuff_xy[thingInMotion][1] = itemy;

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
    stuff_xy[thingInMotion][0] = mx - diffx;
    stuff_xy[thingInMotion][1] = my - diffy;
    drawStuff();
}

function drawStuff() {
    ctx.clearRect(0, 0, 800, 600);
    ctx.strokeStyle = "rgb(169, 209, 142)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 800, 600);

    for(var i=0; i<stuff.length; i++){
        // stuff[i].draw();
        Sliced(stuff_xy[i][0], stuff_xy[i][1]);
    }
}

function dropit(e){
    canvas.removeEventListener("mousemove", moveit, false); // 이벤트 제거
    onFace();
    canvas.removeEventListener("mouseup", dropit, false); // 이벤트 제거
}

function onFace() {
    left_cu=Math.floor(random);
    console.log(random);
    for(var i=0; i<stuff.length; i++){
        if(stuff_xy[i][0]>=220 && 493>=stuff_xy[i][0]
            && stuff_xy[i][1]>=190 && 464>=stuff_xy[i][1]+75)
            left_cu--;
    }
    document.getElementById("left").innerHTML = (left_cu+1) +" 개";
    if((left_cu+1)==0)
        alert("오이를 모두 올렸습니다!");
}