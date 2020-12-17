function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}
//addLoadEvent(func1);
//addLoadEvent(func2);
//addLoadEvent(function() {
//    document.body.style.backgroundColor = '#EFDF95';
//})

