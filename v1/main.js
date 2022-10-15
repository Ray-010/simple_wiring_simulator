var canvas = document.getElementById("draw");
var base_canvas = document.getElementById("base");
var layer = document.getElementById("layer"); 

const base_ctx = base_canvas.getContext("2d");

var win_width = window.innerWidth;
var win_height = window.innerHeight;

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

function set_canvas_size(element){
  element.setAttribute("width", win_width*0.8);
  element.setAttribute("height", win_height*0.8);
}

$(document).ready( function() {
  win_width = window.innerWidth;
  win_height = window.innerHeight;
  set_canvas_size(layer);
  set_canvas_size(base_canvas);
  set_canvas_size(canvas);
  set_grid();

  layer.classList.remove("hidden")
})

// windowサイズ変更時にcanvasのサイズを合わせる
window.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("resize", function() {
    win_width = window.innerWidth;
    win_height = window.innerHeight;
    set_canvas_size(layer);

    layer_border.style.border = "";
    
    set_canvas_size(base_canvas);
    set_canvas_size(canvas);
    ctx.lineWidth = 2;

    Redraw()
    set_grid();
  });
})
