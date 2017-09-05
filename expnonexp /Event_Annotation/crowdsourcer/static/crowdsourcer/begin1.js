var begin_trigger;
var key_id;
$(document).ready(function(){
hrefsp = window.location.href.split("/")


if(window.location.href.includes("begin1")){
  begin_trigger=1
}else if(window.location.href.includes("begin4")){
  begin_trigger=4
}

  $(".begin_button").on('mouseover', function(){
    $(this).css("background-color", "white");

  }).on('mouseout', function(){
    $(this).css("background-color", "#E0E0E0");
  }).on('click', function(){
    Begin();
  })
})

Begin = function(status){
  $.ajax({
    url: '/crowdsourcer/cal_initial',
    data: {
      'session_type' : begin_trigger
    },
    dataType: 'json',
    success: function(data){
      console.log(data.rd)
      window.location.href = data.rd;
  },
    error: function(data){
      alert("No work to do")
    }

  });
}
