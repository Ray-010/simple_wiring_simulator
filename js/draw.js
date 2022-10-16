let oldX = null;//始点
let oldY = null;//始点
let newX = null;//終点
let newY = null;//終点
let mouse_move = false;
let line_color = "#ff0000"
let line_width = 3;
let grid_spacing = 15;
let mode = "line"

const layer = document.getElementById("layer"); 
const base_canvas = document.getElementById("base");
const anime_canvas = document.getElementById("animation");
const base_ctx = base_canvas.getContext("2d");
const canvas = new fabric.Canvas("draw");


$(document).ready( function() {
  win_width = window.innerWidth;
  win_height = window.innerHeight;
  base_canvas.setAttribute("width", win_width*0.8);
  base_canvas.setAttribute("height", win_height*0.8);
  anime_canvas.setAttribute("width", win_width*0.8);
  anime_canvas.setAttribute("height", win_height*0.8);
  canvas.setDimensions({width: win_width*0.8, height: win_height*0.8})
  set_grid();

  layer.classList.remove("hidden")
})

window.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("resize", function() {
    win_width = window.innerWidth;
    win_height = window.innerHeight;
    base_canvas.setAttribute("width", win_width*0.8);
    base_canvas.setAttribute("height", win_height*0.8);
    anime_canvas.setAttribute("width", win_width*0.8);
    anime_canvas.setAttribute("height", win_height*0.8);
    canvas.setDimensions({width: win_width*0.8, height: win_height*0.8})
    set_grid();
  });
})

function set_grid() {
  base_ctx.clearRect(0,0,base_canvas.width,base_canvas.height);
  for(let y=0; y<Math.round((win_height/grid_spacing)); y++) {
    for(let x=0; x<Math.round((win_width/grid_spacing)); x++) {
      base_ctx.beginPath();
      base_ctx.globalAlpha = 0.2;
      // (x, y, r, )
      base_ctx.arc(x*grid_spacing, y*grid_spacing, 2, 0, Math.PI*2, true);
      base_ctx.stroke();
    }
  }
}

// 図形生成
function add_line(x1, y1, x2, y2, color) {
  canvas.add(new fabric.Line(
    // (始点x, y, 終点x, y)
    [x1, y1, x2, y2], {
      strokeWidth: line_width, //太さ
      stroke: color,
      selectable: false,
      hasControls: false,
      hoverCursor: "default",
  }));
}

function add_rec(x1, y1, x2, y2, color) {
  canvas.add(new fabric.Rect({
    left: x1, top: y1,
    width: x2-x1, height: y2-y1,
    fill: color,
    opacity: 0.5,
    stroke: "black",
    strokeWidth: line_width,
    selectable: false,
    hasControls: false,
    hoverCursor: "default",
  }));
}

canvas.on("mouse:down", function(options) {
  mouse_move = true;
  oldX = Math.round(options.pointer.x/grid_spacing)*grid_spacing
  oldY = Math.round(options.pointer.y/grid_spacing)*grid_spacing
})

canvas.on("mouse:up", function(options) {
  if(mouse_move && mode!="select") {
    mouse_move = false;
    newX = Math.round(options.pointer.x/grid_spacing)*grid_spacing
    newY = Math.round(options.pointer.y/grid_spacing)*grid_spacing
    if(mode == "line") {
      add_line(oldX, oldY, newX, newY, line_color);
    } else if (mode=="rec") {
      add_rec(oldX, oldY, newX, newY, line_color);
    }
  }
})

// 選択オブジェクトの削除
canvas.on("selection:created", function(options) {
  let activeObjects = canvas.getActiveObjects();
  document.onkeydown = function(e) {
    if(e.key == "Backspace") {
      activeObjects.forEach(obj=>{
        canvas.remove(obj);
    })};
  }
});
canvas.on("selection:updated", function(options) {
  let activeObjects = canvas.getActiveObjects();
  document.onkeydown = function(e) {
    if(e.key == "Backspace") {
      activeObjects.forEach(obj=>{
        canvas.remove(obj);
    })};
  }
})

// selectモードの時の座標計算
canvas.on("object:moving", function(options) {
  let activeObj = canvas.getActiveObject();
  newX = Math.round(activeObj.left/grid_spacing)*grid_spacing
  newY = Math.round(activeObj.top/grid_spacing)*grid_spacing
  activeObj.set({
    left: newX,
    top: newY,
  }).setCoords();
})

// モード切替
color_list = ["red", "blue", "green", "black", "ic", "select"];
function change_color(color, id) {
  canvas.discardActiveObject(); // 選択の全解除
  mode = "line";
  line_color = color;
  let all_obj = canvas.getObjects();
  all_obj.forEach(obj=>{
    obj.hoverCursor = "default";
    obj.selectable = false;
  });

  for(let i=0; i<color_list.length; i++) {
    document.getElementById(color_list[i]).classList.remove("active");
  }
  document.getElementById(id).classList.add("active");
}

function draw_rec(color, id) {
  canvas.discardActiveObject(); // 選択の全解除
  let all_obj = canvas.getObjects();
  mode = "rec";
  line_color = color;
  all_obj.forEach(obj=>{
    obj.hoverCursor = "default";
    obj.selectable = false;
  });

  for(let i=0; i<color_list.length; i++) {
    document.getElementById(color_list[i]).classList.remove("active");
  }
  document.getElementById(id).classList.add("active");
}

function select(id) {
  mode = "select";
  let all_obj = canvas.getObjects();
  all_obj.forEach(obj=>{
    obj.hoverCursor = "move";
    obj.selectable = true;
  });

  for(let i=0; i<color_list.length; i++) {
    document.getElementById(color_list[i]).classList.remove("active");
  }
  document.getElementById(id).classList.add("active");
}

// キャンバス全削除
const clear_btn = document.getElementById("clear_btn");
clear_btn.onclick = function(){
  canvas.clear();
};
