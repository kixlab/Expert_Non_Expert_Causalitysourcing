var questions;
var choices;
var num=3;
$(document).ready(function(e){
  fetch_data(num)

})

fetch_data = function(num){
  $(".but").on('mouseover', function(){
    $(this).css("border-top", "solid 1px white").css("border-bottom", "none")
           .css("border-left", "solid 1px black").css("border-right", "solid 1px black");
  }).on("mouseout", function(){
    $(this).css("border-left", "solid 1px white").css("border-right", "solid 1px white")
           .css("border-top", "solid 1px black").css("border-bottom", "solid 1px black")
  })
  $("#not_expert").on("click", function(){
    var href_set = window.location.href.split("/")
    var indicator = href_set[href_set.length-2]
    console.log(false);
    if(indicator.includes("1")){
    window.location.href = "/crowdsourcer/step1_info_Q_gen"
  }else if(indicator.includes("2")){
    window.location.href= "/crowdsourcer/not_pass"
  }else if(indicator.includes("3")){
    window.location.href= "/crowdsourcer/step3_causal_Q_gen"
  }else if(indicator.includes("4")){
    window.location.href= "/crowdsourcer/not_pass"
  }else if(indicator.includes("5")){
    window.location.href= "/crowdsourcer/step5_causality_interpret_n"
  }
  })
  $("#submit").on("click", function(){
    var expert = true;
    for (var j = 0; j< num; j++){
      var name = "q"+(j+1).toString()+"_a";
      var checked = $("input[name='"+name+"']:checked").val()
      if(checked != undefined){
        checked = parseInt(checked)
        if(choices[j*5+checked-1]['answer']==false){
          expert=false;
        }
      }else{
        expert = false;
      }
    }
    console.log(expert);
    var href_set = window.location.href.split("/")
    var indicator = href_set[href_set.length-2]
    console.log(indicator)
    if(indicator.includes("1")){
      if(expert){
        console.log("expert!")
        window.location.href= "/crowdsourcer/not_pass"
      }else{
        window.location.href = "/crowdsourcer/step1_info_Q_gen"
      }
    }else if(indicator.includes("2")){
      if(expert){
        window.location.href = "/crowdsourcer/step2_info_Q_ans"
      }else{
        window.location.href= "/crowdsourcer/not_pass"
      }
    }else if(indicator.includes("3")){
      if(expert){
        window.location.href= "/crowdsourcer/not_pass"
      }else{
        window.location.href = "/crowdsourcer/step3_causal_Q_gen"
      }
    }else if(indicator.includes("4")){
      if(expert){
        window.location.href = "/crowdsourcer/step4_causal_link"
      }else{
        window.location.href= "/crowdsourcer/not_pass"
      }
    }else if(indicator.includes("5")){
      if(expert){
        window.location.href = "/crowdsourcer/step5_causality_interpret_e"
      }else{
        window.location.href = "/crowdsourcer/step5_causality_interpret_n"
      }
    }

  })
  $.ajax({
    url: '/crowdsourcer/fetch_quiz',
    data: {
      "num" : num
    },
    dataType: 'json',
    success: function(data){

      questions = JSON.parse(data.questions)
      console.log(questions)
      choices = JSON.parse(data.choices)
      console.log(choices)
      for(var i =0; i<num; i++){
        $("#q"+(i+1).toString()+"_q").text(questions[i]);
        for(var j=0; j<5; j++){
          var name = "q"+(i+1).toString()+"_a";
          var value = (j+1).toString()
          //$("input[name='q3_a'][value='2']").parent('label').text(choices[i*5+j]['choice'])
          $("input[value='"+value+"'][name='"+name+"']").parent('label').append(choices[i*5+j]['choice'])
        }
      }
  },
    error: function(data){
      alert("Error")
    }

  });
}
