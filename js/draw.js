let oldX = null;//始点
let oldY = null;//始点
let newX = null;//終点
let newY = null;//終点
let mouse_move = false;
let line_color = "#ff0000"
let rec_line_color = "#808080"
let rec_color = "#000000"
let line_width = 3;
let grid_spacing = 15;
let mode = "line"
let modes = ["line", "rec", "select"];

let activeObjLeft = null;
let activeObjTop = null;

const layer = document.getElementById("layer"); 
const base_canvas = document.getElementById("base");
const anime_canvas = document.getElementById("animation");
const base_ctx = base_canvas.getContext("2d");
const canvas = new fabric.Canvas("draw");

// Canvas Setting ---------------------------------------------------------------
let win_width = window.innerWidth;
let win_height = window.innerHeight;
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
function set_canvas() {
  base_canvas.setAttribute("width", win_width);
  base_canvas.setAttribute("height", win_height*0.9);
  anime_canvas.setAttribute("width", win_width);
  anime_canvas.setAttribute("height", win_height*0.9);
  canvas.setDimensions({width: win_width, height: win_height})
  set_grid();
}
$(document).ready( function() {
  set_canvas();
  // LocalStorageにデータがあれば反映
  if(localStorage.getItem("canvas") != null) {
    var canvas_json = localStorage.getItem("canvas");
    canvas.loadFromJSON($.parseJSON(canvas_json), canvas.renderAll.bind(canvas));
    let all_obj = canvas.getObjects();
    all_obj.forEach(obj=>{
      obj.hoverCursor = "default";
      obj.selectable = false;
      obj.hasControls = false;
    });
  }
  layer.classList.remove("hidden")
})

window.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("resize", function() {
    win_width = window.innerWidth;
    win_height = window.innerHeight;
    set_canvas()
  });
})

// Create graphic ---------------------------------------------------------------
function add_line(x1, y1, x2, y2) {
  canvas.add(new fabric.Line(
    // (始点x, y, 終点x, y)
    [x1, y1, x2, y2], {
      strokeWidth: line_width, //太さ
      stroke: line_color,
      selectable: false,
      hasControls: false,
      hoverCursor: "default",
  }));
}
function add_rec(x1, y1, x2, y2) {
  canvas.add(new fabric.Rect({
    left: x1, top: y1,
    width: x2-x1, height: y2-y1,
    fill: "rgba(0, 0, 0, 0.2)",
    stroke: rec_line_color,
    strokeWidth: line_width,
    selectable: false,
    hasControls: false,
    hoverCursor: "default",
  }));
}

// Canvas Events ---------------------------------------------------------------
canvas.on("mouse:down", function(options) {
  mouse_move = true;
  if(mode=="rec") {
    oldX = Math.round(options.pointer.x/grid_spacing)*grid_spacing-(grid_spacing/2)
    oldY = Math.round(options.pointer.y/grid_spacing)*grid_spacing-(grid_spacing/2)
  } else{
    oldX = Math.round(options.pointer.x/grid_spacing)*grid_spacing
    oldY = Math.round(options.pointer.y/grid_spacing)*grid_spacing
  }
  let activeObject = canvas.getActiveObject();
  if(activeObject) {
    activeObjLeft = activeObject.left;
    activeObjTop = activeObject.top;
  }
})
canvas.on("mouse:up", function(options) {
  if(mouse_move && mode!="select") {
    mouse_move = false;
    if(mode=="rec") {
      newX = Math.round(options.pointer.x/grid_spacing)*grid_spacing-(grid_spacing/2)
      newY = Math.round(options.pointer.y/grid_spacing)*grid_spacing-(grid_spacing/2)
    } else {
      newX = Math.round(options.pointer.x/grid_spacing)*grid_spacing
      newY = Math.round(options.pointer.y/grid_spacing)*grid_spacing
    }
    if(mode == "line") {
      add_line(oldX, oldY, newX, newY);
    } else if (mode=="rec") {
      add_rec(oldX, oldY, newX, newY);
    }
  }
})

// 選択オブジェクトの削除
canvas.on("selection:created", function(options) {
  let activeObjects = canvas.getActiveObjects();
  document.onkeydown = function(e) {
    if(e.key == "Backspace" && mode == "select") {
      activeObjects.forEach(obj=>{
        canvas.remove(obj);
    })};
  }
});
canvas.on("selection:updated", function(options) {
  let activeObjects = canvas.getActiveObjects();
  document.onkeydown = function(e) {
    if(e.key == "Backspace" && mode == "select") {
      activeObjects.forEach(obj=>{
        canvas.remove(obj);
    })};
  }
})

// selectモードの時の座標計算
canvas.on("object:moving", function(options) {
  let activeObj = canvas.getActiveObject();
  newX = activeObjLeft + Math.round((options.pointer.x-oldX)/grid_spacing)*grid_spacing;
  newY = activeObjTop + Math.round((options.pointer.y-oldY)/grid_spacing)*grid_spacing;
  activeObj.set({
    left: newX,
    top: newY,
  }).setCoords();
})

// モード切替
operations = ["line", "rec", "select"];
colors = ["red", "blue", "green", "black", "purple", "brown", "orange", "yellow", "gray"];

function change_color(color, id) {
  line_color = color;
  change_mode("line");
  for(let i=0; i<colors.length; i++) {
    document.getElementById(colors[i]).classList.remove("active");
  }
  document.getElementById(id).classList.add("active");
}

function change_mode(draw_mode) {
  canvas.discardActiveObject(); // 選択の全解除
  mode = draw_mode;
  let all_obj = canvas.getObjects();
  if(draw_mode=="select") {
    all_obj.forEach(obj=>{
      obj.hoverCursor = "move";
      obj.selectable = true;
    });
  } else {
    all_obj.forEach(obj=>{
      obj.hoverCursor = "default";
      obj.selectable = false;
    });
  }
  for(let i=0; i<operations.length; i++) {
    document.getElementById(operations[i]).classList.remove("active");
  }
  document.getElementById(draw_mode).classList.add("active");
}

// キャンバス全削除
const clear_btn = document.getElementById("clear_btn");
clear_btn.onclick = function(){
  alarm_text = "特定の要素の削除は選択モードの状態でBackSpaceで消せます。\n本当に全部削除しても良いですか?";
  if (window.confirm(alarm_text)) {
    canvas.clear();
    localStorage.removeItem("canvas");
  }
};
