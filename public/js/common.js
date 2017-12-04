/**
 * Created by GK on 2017/10/10.
 */
var modalshow = (actionStr) => {
  console.log(actionStr);
  $("input[name='status']").val(actionStr);
  let e1 = document.getElementById('modal-overlay');
  e1.style.visibility = (e1.style.visibility == "visible" ) ? "hidden" : "visible";
}

//获取url里的参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}