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
document.addEventListener("keydown", e=> {
  if(e.ctrlKey && e.key == "s") {
    e.preventDefault();
    if(storageAvailable()) {
      save_data();
      window.alert("保存しました");
    } else {
      window.alert("LocalStorageへの保存に失敗しました");
    }
  }
})

window.onmousewheel = function(e) {
  idx = modes.indexOf(mode);
  if(e.wheelDelta>=0) {
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
