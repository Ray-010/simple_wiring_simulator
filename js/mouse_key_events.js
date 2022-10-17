
function storageAvailable(type="localStorage") {
  try {
    // 試験的にWebStorageを利用する
    const storage = window[type];
    const x = '__storage_test__';  // 試験的に保存する値
    storage.setItem(x, x);
    storage.removeItem(x);
    return(true);
  }
  catch(e) {
    return(false);
  }
}

// save
function save_data() {
  let canvas_json = canvas.toJSON();
  localStorage.setItem("canvas", JSON.stringify(canvas_json));
}

window.onmousewheel = function(options) {
  idx = modes.indexOf(mode);
  if(options.wheelDelta>=0) {
    idx++;
    if(idx >2) idx = 0;
  } else {
    idx--;
    if(idx < 0) idx = 2;
  }
  change_mode(modes[idx]);
}

$(window).on("beforeunload", function(e) {
  save_data();
})

// copy and paste
let copied = false
function copy_obj() {
  let activeObj = canvas.getActiveObject();
  if(activeObj) {
    copied = true;
    activeObj.clone(function(cloned) {
      _clipboard = cloned;
    });
  }
}

function paste_obj() {
  if(copied) {
    _clipboard.clone(function(clonedObj) {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + grid_spacing,
        top: clonedObj.top + grid_spacing,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function(obj) {
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      _clipboard.top += grid_spacing;
      _clipboard.left += grid_spacing;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }
}



document.addEventListener("keydown", e=> {
  // save
  if(e.ctrlKey && e.key == "s") {
    e.preventDefault();
    if(storageAvailable()) {
      save_data();
      window.alert("保存しました");
    } else {
      window.alert("LocalStorageへの保存に失敗しました");
    }
  
  // copy & paste
  } else if(e.ctrlKey && e.key == "c") {
    e.preventDefault();
    if(mode=="select") copy_obj();

  } else if(e.ctrlKey && e.key == "v") {
    e.preventDefault();
    if(mode == "select") paste_obj();

    let all_obj = canvas.getObjects();
    all_obj.forEach(obj=>{
      obj.hoverCursor = "move";
      obj.hasControls = false;
      obj.selectable = true;
    });
  }
})


