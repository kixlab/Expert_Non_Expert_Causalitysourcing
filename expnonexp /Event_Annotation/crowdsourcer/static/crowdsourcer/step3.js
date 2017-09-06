var title, summary;

var gen_q_num=0;
var ex_num=0;

var names = []
var ids = []

var to_be_shown = []

var q_sets;
var q_sets_2;
var generate=[];
var shown_q = [];
var back_q = [];

var gen_q = -1;

var gen_sel=-1;
var other_sel=-1;
var addition=0;
$(document).ready(function(e){
  $("#proceed").on("click", function(){
    $("#pre_tutorial").css("visibility", "hidden")
    $("#overlay").css("visibility", "hidden")
  })

$("#v_prompt_cancel").on("click", function(){
  $("#vote_prompt").css("visibility","hidden")
  $("#v_prompt_box").text("")
  $("#overlay").css("visibility", "hidden");
})

  question_adder();
  target_text_ready();

  fetch_questions();
  fetch_questions2();
})

question_adder = function(){
  $("#add").on("mouseover", function(){
    $(this).css("color","green")
  })
  .on("mouseout", function(){
    $(this).css("color","black")
  }).on("click", function(){
    addition++;
    if($(".question_type").val()!="" && $(".question_type").val()!=undefined){
      dic={}
      dic['group_id'] = gen_q;
      dic['question'] = $(".question_type").val()
      dic['num_vote'] = 0;
      dic['id']=gen_q;
      generate.push(dic);
      console.log(generate)
      $(".question_type").val("")
      $(".gen_q_sets").append("<div><div class='gen_q' id='gen"+dic['group_id'].toString()+"'>"+dic['question']+"</div><input type='button' value='Del' class='ssbut' id='del_"+dic['group_id'].toString()+"'></div>")
      $(".gen_q_sets").scrollTop(function(){
          console.log("scrollheight", $(this)[0].scrollHeight)
          return $(this)[0].scrollHeight
      })
      console.log($("#del_"+dic['group_id'].toString()).attr('id'))
      $("#del_"+dic['group_id'].toString()).on("mouseover", function(){
        $(this).css("color", "red");
      }).on("mouseout", function(){
        $(this).css("color", "black");
      }).on("click", function(){
        addition--;
        console.log($(this).attr("id").substr(4))
        generate = remove_group_id(generate, parseInt($(this).attr("id").substr(4)))
        console.log(generate)
        $(this).parent("div").remove();
      })
      gen_q--;
    }else{
      alert("Please type in the question")
    }
  })
}

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
      }).on("click", function(){
        if(generate.length>1){
          $("#tutorial_pane").text("Now you are shown other's causal questions. You can vote for questions that is good, and put your own question as similar to one of the question made by others. If you select click one of other's question, you can see a group of similar questions, and vote for the best one among them. If you drag one of your question to other's question, then you can group your question with other's question, and can do vote. Also, you can add more questions which does not overlap with alreay existing question. If you are done, proceed with Next button.")
          Show_next_or_return()
        }else{
          alert("Please add more than 2 questions.")
        }
      })
  },
    error: function(data){
      alert("Error")
    }
  })
}
Show_next_or_return = function(){
  if(q_sets_2.length>0){

    Show();
  }else{
    console.log(generate.concat(back_q))
    Return_data();
  }
}


entity_question_add= function(id){
  $("#"+id).off("mouseover").off("mouseout").css("border", "solid 1px black")
  .attr("href", function(){return "javascript:"})
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

entity_question_cancel= function(id){
  $("#"+id).css("border", "solid 1px #e5e5e5").on("mouseover", function(){
    $(this).css("background-color", "white")
    .css("border", "solid 1px #e5e5e5")
  }).on("mouseout", function(){
    $(this).css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
  }).attr("href", function(){return "javascript:"})
  $("#set_"+id).css("visibility","hidden").css("height","0").css("position","absolute")
    .find(".gen_q_sets").children().css("visibility", function(){
      var ii =parseInt($(this).attr("id").substr(7))
      generate = remove_group_id(generate, ii)
      return "visible"
    }).remove();
  $("#"+id+"_add").css("height","0");
}

fetch_questions=function(){
  $.ajax({
    url: '/crowdsourcer/fetch_q_a_step3',
    data: {

    },
    dataType: 'json',
    success: function(data){
      q_sets=JSON.parse(data.q_a_set);
      console.log(q_sets)
      for(var i=0; i<q_sets.length; i++){
        var sub_enti=q_sets[i]
        if(sub_enti['question_group'].length!=0){
          id = sub_enti['entity']
          console.log(id)
          $("#question_box").append("<div class='entity_q_set' id='set_"+id+"'><div class='entity_q_title' id='title_"+id+"'>"+$("#"+id).attr("title")+"</div>");
          for(var j=0; j<sub_enti['question_group'].length; j++){
            var q = sub_enti['question_group'][j]
            $("#set_"+id).append("<div class='q_a_set' id='"+id+"_"+j.toString()+"' name='"+i.toString()+"'></div>")
            var toappend="<div class='ents'>"
            for(var l=0; l<q['ent_list'].length;l++){
              if(q['ent_list'][l]!=id){
              var t = $("#"+q['ent_list'][l]).attr("title")

              toappend=toappend+"+"+t
            }
            }
            toappend=toappend+"</div>"

            $("#"+id+"_"+j.toString()).append(toappend+"<div class='q'>Q : "+q['question']+"</div><div class='a'>A : "+q['answer']+"</div>")
            .on("mouseover", function(){
              $(this).css("background-color", "#e5e5e5")
              var subid =$(this).attr('id').split("_")
              subid= parseInt(subid[subid.length-1])
              id = parseInt($(this).attr('name'))
              for(var k=0; k<q_sets[id]['question_group'][subid]['ent_list'].length; k++){
                console.log(q_sets[id]['question_group'][subid]['ent_list'][k])
                $("#"+q_sets[id]['question_group'][subid]['ent_list'][k]).css("border", "solid 1px black")
              }
            }).on("mouseout", function(){
              id = parseInt($(this).attr('name'))
              $("a").css("border", function(){
                if($(this).attr("id")!=q_sets[id]['entity']){
                  return "solid 1px transparent";

                }else{
                  return "solid 1px black"
                }
              })

              $(this).css("background-color", "transparent")
            })
          }
          if(sub_enti['question_group'].length>0){
          $("#"+id).on("mouseover", function(){
            $("a").css("background-color", "#e5e5e5")
            .css("border", "solid 1px transparent")
            $(".entity_q_set"+$(this).attr('id')).css("visibility", "hidden").css("position","absolute")
            $(this).css("background-color", "white")
            .css("border", "solid 1px #e5e5e5")
            $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")

            $("#set_"+$(this).attr('id')).css("visibility", "visible").css("position","static")
          }).on("mouseout", function(){
            $(this).css("background-color", "#e5e5e5")
            .css("border", "solid 1px transparent")
            $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")
          }).on("click", function(){
              entity_on_click(this);
          })
        }
      }
      }

  },
    error: function(data){
      alert("Error")
    }
  })
}

entity_on_click = function(t){
  $("a").off('click').off('mouseout').off('mouseover')
  $(t).css("border", "solid 1px black").on("mouseover",function(){
    $(this).css("color", "grey")
  }).on("mouseout", function(){
    $(this).css("color","black")
  }).on("click", function(){
    entity_off_click(this)
    })
}
entity_off_click = function(t){
  var len = q_sets.length
  for (var i=0; i<len; i++){
    if(q_sets[i]['question_group'].length>0){
  $("#"+q_sets[i]['entity']).on("mouseover", function(){
    $("a").css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
    $(".entity_q_set"+$(this).attr('id')).css("visibility", "hidden").css("position","absolute")
    $(this).css("background-color", "white")
    .css("border", "solid 1px #e5e5e5")
    $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")

    $("#set_"+$(this).attr('id')).css("visibility", "visible").css("position","static")
  }).on("mouseout", function(){
    $(this).css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
    $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")
  }).on("click", function(){
      entity_on_click(this);
  })
}
}
}

fetch_questions2 = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_prev_why_q_step3',
    data: {
    },
    dataType: 'json',
    success: function(data){
    q_sets_2 = JSON.parse(data.prev_q);
    console.log(q_sets_2)

    for(var i=0; i<q_sets_2.length; i++){
      var q_list = q_sets_2[i]['q_list']
      var max_vote = -1;
      var m_vote_index = -1;
      for(var j=0; j<q_list.length; j++){
        if(q_list[j]['num_vote']>max_vote){
          max_vote=q_list[j]['num_vote'];
          m_vote_index = j
        }
      }

      $("#question_box_other").append("<div id='prev_q_set_"+i.toString()+"_"+m_vote_index.toString()+"' class='other_q_set'>"+q_list[m_vote_index]['question']+"</div>");
    }

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
  sending = generate.concat(back_q);
  console.log(sending);


  $.ajax({
    url: '/crowdsourcer/step3_return',
    data: {
      'data' : JSON.stringify(sending),
    },
    dataType: 'json',
    success: function(data){
      window.location.href="/crowdsourcer/end_3/"
  },
    error: function(data){
      alert("Error")
    }
  })
}




Show = function(subject_id){
  addition = 0;
  $(".gen_q_sets").css("height", "35%")
  $("#question_box_self").css("height", "42.5%")
  $("#explanation_2").text("Please group your question with others if they are similar, or vote for others if they are good questions.")
  $("#submit").off('click').on('click', function(){

    Return_data();

  })
  $(".ssbut").remove()//.attr("type", "radio").attr("name", "self_r").off("click").off("mouseout").off("mouseover")
  $("#question_box_other_box").css("visibility", "visible").css("position", "static")
  $("#question_box_other").css("visibility", "visible").css("position", "static")
  $(".other_q_set").on('click', function(){
    splset = $(this).attr("id").split("_")
    id = parseInt(splset[splset.length-1])
      other_q_prompt(id, this)
  }).droppable({
    drop: function(event, ui){
      splset = $(this).attr("id").split("_")
      id = parseInt(splset[splset.length-2])
      var gen_id = parseInt($(ui.draggable).attr("id").substr(3))
      var gen_true_id = $(ui.draggable).attr("id")
      console.log(gen_id)
      self_prompt(id, this, gen_id, gen_true_id)
    }
  }).on("mouseover", function(){
    $(this).css("color", "grey")
  }).on("mouseout", function(){
    $(this).css("color", "black")
  })

  $(".gen_q").draggable({
    axis: "y",
    helper: "clone",
    revert: "true",

  }).on("mouseover", function(){
    $(this).css("color", "grey")
  }).on("mouseout", function(){
    $(this).css("color", "black")
  })

    $(".other_q_buts").on("click", function(){
      radio_uncheck($(this));
    })
    $(".ssbut").on("click", function(){
      radio_uncheck($(this));
    })



  }

other_q_prompt = function(other_g_id, t){
  var group= q_sets_2[other_g_id]['q_list']
  if(group.length<2){
    var dic = q_sets_2[other_g_id]['q_list'][0]
    dic['group_id'] = other_g_id
    dic['num_vote']+=1;
    back_q.push(dic);
    $(t).off("click").droppable('disable').off("mouseover").off("mouseout").css("color", "#e5e5e5")
    alert("Your vote is reflected")
    return;
  }

  console.log(other_g_id)
  $("#vote_prompt").css("visibility", "visible")
  $("#overlay").css("visibility", "visible")

  for (var i =0; i<group.length; i++){
      $("#v_prompt_box").append("<div class='prompt_question' id='"+other_g_id.toString()+"_"+i.toString()+"'>"+group[i]['question']+"<input type='radio' class='voting_r' name='voting'></div>")
      $("#"+other_g_id.toString()+"_"+i.toString()).find(".voting_r").on("click", function(){
        var idtot = $(this).parent('div').attr('id').split("_")
        var other_g_id = parseInt(idtot[0])
        var q_id = parseInt(idtot[1])
        var dic = q_sets_2[other_g_id]['q_list'][q_id]
        dic['group_id'] = other_g_id
        dic['num_vote']+=1;
        console.log(dic)
        back_q.push(dic);

        $("#vote_prompt").css("visibility", "hidden");
        $("#overlay").css("visibility", "hidden");
        $("#v_prompt_box").text("");
        $(t).off("click").droppable('disable').off("mouseover").off("mouseout").css("color", "#e5e5e5")
        })
  }
}
self_prompt=function(other_g_id, t, gen_id, gen_true_id){
  var group= q_sets_2[other_g_id]['q_list']
  $("#vote_prompt").css("visibility", "visible")
  $("#overlay").css("visibility", "visible")

  for (var i =0; i<group.length; i++){
      $("#v_prompt_box").append("<div class='prompt_question' id='"+other_g_id.toString()+"_"+i.toString()+"'>"+group[i]['question']+"<input type='radio' class='voting_r' name='voting'></div>")
      $("#"+other_g_id.toString()+"_"+i.toString()).find(".voting_r").on("click", function(){
        var idtot = $(this).parent('div').attr('id').split("_")
        var other_g_id = parseInt(idtot[0])
        var q_id = parseInt(idtot[1])
        var dic = q_sets_2[other_g_id]['q_list'][q_id]
        dic['group_id'] = other_g_id
        dic['num_vote']+=1;
        console.log(dic)
        back_q.push(dic);
        var gen_id = $("input[name='self_r']:checked").attr("id")
        if(gen_id != undefined){
          gen_id = gen_id.substr(4)
          gen_id = parseInt(gen_id)
          generate[find_group_id(generate, gen_id)]['num_vote']=0;
          generate[find_group_id(generate, gen_id)]['group_id']=other_g_id;
        }
        $("#vote_prompt").css("visibility", "hidden");
        $("#overlay").css("visibility", "hidden");
        $("#v_prompt_box").text("");
        $(t).off("click").droppable('disable').off("mouseover").off("mouseout").css("color", "#e5e5e5")
        $("#"+gen_true_id).off("click").draggable("disable").off("mouseout").off("mouseover").css("color","#e5e5e5")
    })
  }
  //var gen_id = $("input[name='self_r']:checked").attr("id")
  if(gen_id != undefined){
    //gen_id = gen_id.substr(4)
    //gen_id = parseInt(gen_id)
    $("#v_prompt_box").append("<div class='prompt_question' id='generated_q_"+other_g_id.toString()+"'>"+$("#gen"+gen_id.toString()).text()+"<input type='radio' class='voting_r' name='voting' value='"+gen_id.toString()+"'></div>")
    $("#generated_q_"+other_g_id.toString()).find('.voting_r').off('click').on('click', function(){
      //var gen_id = parseInt($("input[name='voting']:checked").val())
      var other_g_id = parseInt($(this).parent('div').attr("id").substr(12))
      console.log(generate[find_group_id(generate, gen_id)])
      generate[find_group_id(generate, gen_id)]['num_vote']=1
      generate[find_group_id(generate, gen_id)]['group_id']=other_g_id
      console.log(generate[find_group_id(generate, other_g_id)])
      $("#vote_prompt").css("visibility", "hidden");
      $("#overlay").css("visibility", "hidden");
      $("#v_prompt_box").text("");
      $(t).off("click").droppable('disable').off("mouseover").off("mouseout").css("color", "#e5e5e5")
      $("#"+gen_true_id).off("click").draggable('disable').off("mouseout").off("mouseover").css("color","#e5e5e5")

    })
  }

}


  radio_uncheck = function(thisRadio){
    console.log("dd");
    if (thisRadio.hasClass("imChecked")) {
        thisRadio.removeClass("imChecked");
        thisRadio.prop('checked', false);
    } else {
        thisRadio.prop('checked', true);
        thisRadio.addClass("imChecked");
    };
  }
