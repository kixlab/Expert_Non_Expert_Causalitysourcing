var title, summary;

var gen_q_num=0;
var ex_num=0;

var names = []
var ids = []

var to_be_shown = []

var q_sets;
var generate=[];
var shown_q = [];
var back_q = [];

var gen_q = -1;

var gen_sel=-1;
var other_sel=-1;
var addition=0;

var cur_q;

var done_q=[];
$(document).ready(function(e){
  $("#proceed").on("click", function(){
    $("#pre_tutorial").css("visibility", "hidden")
    $("#overlay").css("visibility", "hidden")
  })
$("#v_prompt_cancel").on("click", function(){
  $("#vote_prompt").css("visibility","hidden").css("position", "absolute")
  $("#v_prompt_box").text("")
  $("#overlay").css("visibility", "hidden");
})

  target_text_ready();

  fetch_questions();
})

target_text_ready = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_target_text',
    data: {
    },
    dataType: 'json',
    success: function(data){

      title = data.title;
      $("#target_title").text(title)
      summary = data.summary;
      $("#target_summary").append(summary)
      $("sup").remove();
      $("a").attr("id", function(){
        names.push($(this).attr("title"))
        ids.push($(this).attr("title").replace(/ /gi, "_").split("(")[0])
        return  $(this).attr("title").replace(/ /gi, "_").split("(")[0]})
      .attr("href", function(){return "javascript:"})

      //gen_entities();

      $("#submit").on("mouseover", function(){
        $(this).css("color", "green");
      }).on("mouseout", function(){
        $(this).css("color", "black");
      })
  },
    error: function(data){
      alert("Error")
    }
  })
}
Show_next_or_return = function(){
  var subject_id=[]
  var to_next = false;
  for(var i=0; i<q_sets.length; i++){
    for(var j=0; j<generate.length; j++){
      if(generate[j]['entity']==q_sets[i]['entity']){
        if(q_sets[i]['q_g_list'].length>0){
          if(subject_id.indexOf(i)<0){
            subject_id.push(i)

          }
          to_next = true;

        }
      }
    }
  }
  if(to_next){
    Show(subject_id);
  }else{
    Return_data();
  }
}


entity_question_add= function(id){
  $("#"+id).off("mouseover").off("mouseout").css("border", "solid 1px black")
  .attr("href", function(){return "javascript:entity_question_cancel('"+$(this).attr("id")+"')"})
  if($("#set_"+id).length){
    $("#set_"+id).css("visibility", "visible").css("height", "100%").css("position","relative")
    $("#"+id+"_add").css("height","100%");
  }else{


}
  $("#type"+id).focus()
}

function find_group_id(list, id){
  for(var i =0; i<list.length; i++){
    if(list[i]['group_id']==id){
      return i
    }
  }
  return null;
}
function remove_group_id(l, id){
  for(var i =0; i<l.length; i++){
    if(l[i]['group_id']==id){
      if(l.length!=1){
        console.log(l[i])
        console.log(i)
        l.splice(i, 1)
      return l;
    }else{
      return []
    }
    }
  }
}

function find_q_sets_id(id){

}

fetch_questions=function(){
  $.ajax({
    url: '/crowdsourcer/fetch_q1_for_answer',
    data: {
      'done' : JSON.stringify(done_q)
    },
    dataType: 'json',
    success: function(data){
      if(data.end){
        window.location.href = '/crowdsourcer/end_2/'
      }
      $("#tutorial_pane").text("Answer the question in the right side of the pane. You should consider that they are questions from those who do not know much about the domain. Please make your answer understandable, and easy to read. After you are done please press Next button.")

      $("#answer_prompt").text("Write like you are teaching novice.")
      cur_q = JSON.parse(data.a_question)
      done_q.push(cur_q['group_id'])
      console.log(cur_q)
      console.log(cur_q['entity'])
      var subject_text = ""
      for(var i =0; i<cur_q['entity'].length; i++){
        if(i!=0){
          subject_text=subject_text+", "
        }
        subject_text= subject_text+cur_q['entity'][i]

      }
      $("#subject").text(subject_text);
      $("a").css("background-color","transparent")
      for(var i=0; i<cur_q['entity'].length; i++){
      $("#"+cur_q['entity'][i]).css("background-color", "#e5e5e5")
    }
      for(var i=0; i<cur_q['answer_list'].length; i++){
        $("#other_"+(i+1).toString()).text(cur_q['answer_list'][i]['answer'])
      }
      $("#question_box").text("Q : "+cur_q['question']);
      $("#submit").off('click').on("click", function(){
        if($("#write_pane").val().length>5){
        if(cur_q['answer_list'].length==0){
          console.log("no added answers")
            Return_data();
          }else{
            console.log("to next");
            $("#tutorial_pane").text("Now you can see answers by others above your input. Please take a look at them and improve your answer by referring to others'.")

            $("#answer_prompt").text($("#answer_prompt").text()+" You can also improve your text by taking a look at others'.")
            $("#others").css("visibility", "visible").css("position", "relative")
            $(".answers").css("visibility", "visible").css("position", "relative");
            $(this).off("click").on("click", function(){
              if($("#write_pane").val().length>5){
                Return_data();
              }else{
                alert("Please write in way novices understand.")
              }
            })
            }
          console.log("not pre answer");
          //Show_next_or_return()
        }else{
          alert("Please write in way novices understand.")
        }
      })
  },
    error: function(data){
      alert("Error")
    }
  })
}

gen_entities=function(){
  var n = JSON.stringify(names)
  var i = JSON.stringify(ids)
  $.ajax({
    url: '/crowdsourcer/gen_entities',
    data: {
      "name" : n,
      "ids" : i,
    },
    dataType: 'json',
    success: function(data){

  },
    error: function(data){
      alert("Error")
    }
  })
}

Return_data= function(){

  sending={}
  sending['entity']=cur_q['entity']
  sending['group_id']=cur_q['group_id']
  sending['answer']=$("#write_pane").val()

  // add others

  $.ajax({
    url: '/crowdsourcer/step2_return',
    data: {
      'data' : JSON.stringify(sending),
    },
    dataType: 'json',
    success: function(data){
      alert("Answer Returned!");
      console.log("data saved");
      $("textarea").val("")
      $(".answers").css("visibility", "hidden").css("position", "absolute")
      $("#others").css("visibility", "hidden").css("position", "absolute")
      fetch_questions();
  },
    error: function(data){
      alert("Error")
    }
  })
}
