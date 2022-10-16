let b_oldX = null;//始点
let b_oldY = null;//始点
let moveX = null;
let moveY = null;
let pX = null;//終点
let pY = null;//終点
let can_mouse_event = false;

const can = document.getElementById("animation");
const ctx = can.getContext("2d");

canvas.on("mouse:down", function(options) {
  b_oldX = Math.round(options.pointer.x/grid_spacing)*grid_spacing
  b_oldY = Math.round(options.pointer.y/grid_spacing)*grid_spacing
  can_mouse_event = true;
})

canvas.on("mouse:move", function(options) {
  ctx.clearRect(0, 0, can.width,can.height);
  if(can_mouse_event) {
    moveX = Math.round(options.pointer.x/grid_spacing)*grid_spacing
    moveY = Math.round(options.pointer.y/grid_spacing)*grid_spacing
    ctx.lineWidth = line_width;

    ctx.beginPath();
    if(mode == "line") {
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = line_color;
      ctx.lineJoin  = "round";
      ctx.lineCap   = "round";
      ctx.moveTo(b_oldX ,b_oldY);
      ctx.lineTo(moveX, moveY);

    } else if (mode == "rec") {
      
      ctx.font = "bold 25px serif";
      ctx.fillStyle = "#000000";
      x_value = Math.abs((moveX-oldX)/grid_spacing)+1;
      y_value = Math.abs((moveY-oldY)/grid_spacing)+1;
      ctx.fillText(`${x_value}x${y_value}`, moveX+5, b_oldY-10);
      ctx.stroke();

      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = line_color;
      ctx.rect(b_oldX, b_oldY, moveX-oldX, moveY-oldY);
      ctx.fill();
    }
    ctx.stroke();
  }
})

canvas.on("mouse:up", function(options) {
  ctx.clearRect(0,0,can.width,can.height);
  can_mouse_event = false;
})
