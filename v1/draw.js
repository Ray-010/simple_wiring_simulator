let oldX = null;//始点
let oldY = null;//始点
let moveX = null;
let moveY = null;
let pX = null;//終点
let pY = null;//終点
let can_mouse_event = false;
let storedLines = [];
let storedRec = [];
let line_color = "#000000"
mode = "line"
let grid_spacing = 15;

const can = document.getElementById("draw");
const ctx = can.getContext("2d");

can.onmousedown = function(e){
  oldX = Math.round(e.offsetX/grid_spacing)*grid_spacing
  oldY = Math.round(e.offsetY/grid_spacing)*grid_spacing
  can_mouse_event = true;
};

can.onmousemove = function(e){
  if(can_mouse_event){
    Redraw();
    moveX = Math.round(e.offsetX/grid_spacing)*grid_spacing
    moveY = Math.round(e.offsetY/grid_spacing)*grid_spacing
    ctx.lineWidth = 2;

    ctx.beginPath();
    if(mode == "line") {
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = line_color;
      ctx.lineJoin  = "round";
      ctx.lineCap   = "round";
      ctx.moveTo(oldX,oldY);
      ctx.lineTo(moveX,moveY);

    } else if (mode == "rec") {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = line_color;
      ctx.rect(oldX, oldY, moveX-oldX, moveY-oldY);
      ctx.fill();
    }
    ctx.stroke();
  }
};

function Redraw(){
  ctx.clearRect(0,0,can.width,can.height);
  if(storedLines.length == 0 && storedRec == 0){
    return;
  }
  for(let i = 0; i<storedLines.length; i++){
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = storedLines[i].color;
    ctx.beginPath();
    ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
    ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
    ctx.stroke();
  }
  for(let i = 0; i<storedRec.length; i++){
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = storedRec[i].color;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.rect(storedRec[i].x, storedRec[i].y, storedRec[i].width, storedRec[i].height);
    ctx.fill();
    ctx.stroke();
  }
}

can.onmouseup = function(e){
  can_mouse_event = false;
  pX = Math.round(e.offsetX/grid_spacing)*grid_spacing
  pY = Math.round(e.offsetY/grid_spacing)*grid_spacing
  if(mode=="line") {
    storedLines.push({
      x1:oldX,
      y1:oldY,
      x2:pX,
      y2:pY,
      color: line_color,
    })
  } else if (mode == "rec") {
    storedRec.push({
      x: oldX,
      y: oldY,
      width: pX-oldX,
      height: pY-oldY,
      color: line_color
    })
  }
};

can.onmouseout = function(){
  can_mouse_event = false;
};

const clear_btn = document.getElementById("clear_btn");
clear_btn.onclick = function(){
  ctx.beginPath();
  ctx.clearRect(0,0,can.width,can.height);
  storedLines.length=0;
  storedRec.length=0;
};

function draw_rec(color) {
  mode = "rec"
  line_color = color
}

function change_color(color) {
  mode = "line"
  line_color = color
}

