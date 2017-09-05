
$(document).ready(function(){
  hrefsp = window.location.href.split("_")
  console.log(hrefsp[hrefsp.length-1])
  var indicator = hrefsp[hrefsp.length-1]
  console.log(indicator)
  if(indicator.includes("1")){
    Show_end()
  }else if(indicator.includes("2")){
    Show_end()
  }else if(indicator.includes("3")){
    $("#prompt1").text("Thank you for participating in the task.")
    $("#prompt2").text("It will be really helpful if you answer one simple question!")
    $("#question").text("Were given materials helpful enough to come up with causal questions?")
    Return_q(3, false);
  }else if(indicator.includes("4")){
    Show_end()
  }else if(indicator.includes("e5")){
    $("#prompt1").text("Thank you for participating in the task.")
    $("#prompt2").text("It will be really helpful if you answer one simple question!")
    $("#question").text("Were given materials helpful in answering the causality question? Were you capable of generating your interpretation?")
    Return_q(5, true);
  }else if(indicator.includes("n5")){
    $("#prompt1").text("Thank you for participating in the task.")
    $("#prompt2").text("It will be really helpful if you answer one simple question!")
    $("#question").text("Were given materials helpful in answering the causality question? Were you capable of generating your interpretation?")
    Return_q(5, false);
  }


})

Return_q = function(step, expert){
  $("#answer").css("visibility","visible")
  $("#return").css("visibility", "visible").on("mouseover", function(){
    $(this).css("color", "green")
  }).on("mouseout", function(){
    $(this).css("color", "black")
  }).on("click", function(){
    if($("#answer").val().length>5){
    Return_question(step, expert);
  }else{
    alert("Please input short answer about the question.")
  }
  })
}

Return_question = function(step, expert){

}

Show_end= function(){
  $("#prompt1").text("Thank you for participating!");
  $("#prompt2").text("")
  $("#question").text("")
  $("#answer").css("visibility", "hidden").css("position", "absolute")
  $("#return").css("visibility", "hidden").css("position", "absolute")
}
