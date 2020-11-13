$(document).ready(function (){

  document.getElementById("submit").addEventListener("click", function() {
  var val = $.trim($("textarea").val());
  if (val != "") {
    alert(val);
  } else{
    alert("no value");
  }
}, false);



$(".button").click(function() {
  $(".inputcontainer").toggleClass("faderight");

  });
});
