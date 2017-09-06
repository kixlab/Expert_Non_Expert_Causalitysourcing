var title, summary;

var survey_code;
var job_done_num=0;
var gen_q_num=0;
var ex_num=0;

var names = []
var ids = []

var to_be_shown = []

var q_sets=[];
var generate={};
var shown_q = [];
var back_q = [];

var irreversible=[];
var alreay_did=[];
var gen_q = -1;

var acu_ent_set =[]
var cur_ent_set = []

var gen_sel=-1;
var other_sel=-1;
var addition=0;

var drag_id=-1;
$(document).ready(function(e){

$("#proceed").on("click", function(){
  $("#pre_tutorial").css("visibility", "hidden")
  $("#overlay").css("visibility", "hidden")
})
$("#v_prompt_cancel").on("click", function(){
  $("#vote_prompt").css("visibility","hidden")
  $("#overlay").css("visibility","hidden")
  $("#v_prompt_box").text("")
  $("#overlay").css("visibility", "hidden");
})
$("#tutorial").on("mouseover", function(){
  $("#tutorial_pane").css("visibility", "visible");
}).on("mouseout", function(){

})

  target_text_ready();

//  fetch_questions();
})

target_text_ready = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_target_text',
    data: {
    },
    dataType: 'json',
    success: function(data){
      survey_code = data.worker_id;
      console.log(survey_code)
      console.log("success")
      title = data.title;
      $("#target_title").text(title)
      summary = data.summary;
      $("#target_summary").append(summary)
      $("sup").remove();
      $("a").on("mouseover", function(){
        $(this).css("background-color", "white")
        .css("border", "solid 1px #e5e5e5")
      }).on("mouseout", function(){
        $(this).css("background-color", "#e5e5e5")
        .css("border", "solid 1px transparent")
      }).attr("id", function(){
        names.push($(this).attr("title"))
        ids.push($(this).attr("title").replace(/ /gi, "_").split("(")[0])
        return  $(this).attr("title").replace(/ /gi, "_").split("(")[0]
      })
      .attr("href", function(){return "javascript:"})
      .on("click", function(){
        entity_on_click(this)
      })
    //  gen_entities();

      $("#submit").on("mouseover", function(){
        $(this).css("color", "green");
      }).on("mouseout", function(){
        $(this).css("color", "black");
      }).on("click", function(){

        if(Object.keys(generate).length==0){
          if(cur_ent_set.length>1){
          if($("#type").val().length>5){
            if(!list_in_list_include(acu_ent_set,cur_ent_set)){
                fetch_entity_questions()
            }else{
              alert("Please do not enter overlapping entities.")
            }

        }else{
          alert("Please enter a question at least makes sense.")
        }
      }else{
        alert("Please involve at least two keywords.")
      }
        }else{
          Return_data();
          //secondary
        }
      })
  },
    error: function(data){
      alert("Error")
    }
  })
}

list_in_list_include=function(a, b){
  for (aa in a){
    console.log(a[aa])
    a[aa].sort();
    b.sort();
    as=""
    bs=""
    for (aaa in a[aa]){
      as = as+a[aa][aaa]
    }
    for(bb in b){
      bs = bs+b[bb]
    }
    if(as==bs){
      return true;
    }
  }
  return false;
}

entity_on_click = function(t){
  var title = $(t).attr("title")
  var id = $(t).attr("id")
  cur_ent_set.push(id)
  console.log(cur_ent_set)
  $("#entities_involved").append("<div id='ent_"+id+"' class='ent'>"+title+"</div>")
  $(t).off("click").off("mouseout").off("mouseover").css("border","solid 1px black").on("click", function(){
      entity_off_click(t)
  })
}
entity_off_click = function(t){
  var index = cur_ent_set.indexOf($(t).attr("id"))
  cur_ent_set.splice(index, 1)
  console.log(cur_ent_set)
  $("#ent_"+$(t).attr("id")).remove()
  $(t).off("click").on("mouseover", function(){
    $(this).css("background-color", "white")
    .css("border", "solid 1px #e5e5e5")
  }).on("mouseout", function(){
    $(this).css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
  }).css("border","solid 1px #e5e5e5").on("click", function(){
      entity_on_click(t)
  })
}

fetch_entity_questions=function(){
  $.ajax({
    url: '/crowdsourcer/fetch_q1',
    data: {
      "cur_ent_set" : JSON.stringify(cur_ent_set)
    },
    dataType: 'json',
    success: function(data){
      $("#tutorial_pane").text("Now you see other's questions above your question. You can link your question to other's similar question by dragging your question to other's. Also you can click on other's question when other's is good question that you could not think of. After doing one of those behavior, you can vote to shown questions, which are grouped to be similar by other participants. If you are done with voting and grouping, then you can proceed with Next button.")
      $("#question_others_title").text("Other's question")
      $("a").off("click").off("mouseout").off("mouseover")
      q_sets = JSON.parse(data.question_groups)
      console.log(q_sets)
      generate['entity_list'] = cur_ent_set
      generate['group_id'] = -1
      generate['question'] = $("#type").val()
      generate['num_vote'] =0
      generate['id'] =-1
      if(q_sets.length==0){
        generate['num_vote']=1
        $("#type").val("");

          Return_data();


      }else{

        $("#question_self").append("<div id='gen_q'>"+$("#type").val()+"</div>")
        $("#gen_q").on("mouseover", function(){
          $(this).css("color", "grey")
        }).on("mouseout", function(){
          $(this).css("color", "black")
        })
        for(var i=0; i<q_sets.length; i++){
          var num_vote = -1;
          var id
          for(var j=0; j<q_sets[i]['list'].length; j++){
            if(num_vote<q_sets[i]['list'][j]['vote']){
              num_vote = q_sets[i]['list'][j]['vote']
              id = j
            }
          }
          $("#question_others").append("<div id='"+i+"' class='other_q'>"+q_sets[i]['list'][id]['question']+"</div>")
          $("#"+i.toString()).on('mouseover', function(){
            $(this).css("color", "grey")
            drag_id = parseInt($(this).attr("id").split("_")[0])
            console.log(drag_id)
          }).on("mouseout", function(){
            $(this).css("color", "black")
            drag_id = -1;
          }).on('click', function(){
            g_id = parseInt($(this).attr("id").split("_")[0])
            //q_id = parseInt($(this).attr("id").split("_")[1])
            if(q_sets[g_id]['list'].length>1){
              $("#overlay").css("visibility","visible")
            $("#vote_prompt").css("visibility", "visible")
            for(var i=0; i<q_sets[g_id]['list'].length; i++){
              $("#v_prompt_box").append("<div id='prompt_"+id+"_"+i+"' class='prompt_element'>"+q_sets[g_id]['list'][i]['question']+"</div>")
            }
          }else{
            if(confirm("Do you think this question is good? Vote for this?")){
            alert("Your vote is reflected!")
            dic={}
            dic['group_id'] = q_sets[g_id]['group_id'];
            dic['num_vote']= q_sets[g_id]['list'][0]['vote']+1
            dic['question'] = q_sets[g_id]['list'][0]['question']
            dic['id'] = q_sets[g_id]['list'][0]['id']
            back_q.push(dic)
            $("#"+g_id.toString()).off("mouseout").off("mouseover").off("click")
            .droppable("disable").css("color","#e5e5e5")
          }
          }
          $('.prompt_element').on("mouseover", function(){
            $(this).css("color", "grey")
          }).on("mouseout", function(){
            $(this).css("color", "black")
          }).on("click", function(){
            console.log($(this).parent("div").find(".prompt_element")[0])
            var g_id = parseInt($(this).parent("div").children()[0].id.split("_")[1])
            if($(this).attr("id")=="prompt_gen_q"){

              generate['num_vote'] =1;

            }else{
              var q_id = parseInt($(this).attr("id").split("_")[2])
              dic={}
              dic['group_id'] = q_sets[g_id]['group_id'];
              dic['num_vote']= q_sets[g_id]['list'][q_id]['vote']+1
              dic['question'] = q_sets[g_id]['list'][q_id]['question']
              dic['id'] = q_sets[g_id]['list'][q_id]['id']
              back_q.push(dic)

            }
            $("#"+g_id.toString()).off("mouseout").off("mouseover").off("click")
            .droppable("disable").css("color","#e5e5e5")
          //  generate['group_id']=q_sets[g_id]['group_id'];
          //  $("#gen_q").draggable("disable").off("mouseout").off("mouseover").css("color","#e5e5e5")
            $("#vote_prompt").css("visibility","hidden")
            $("#overlay").css("visibility","hidden")
            //console.log(generate)
            console.log(back_q)
          })
        }).droppable({
          drop: function(event, ui){
            drag_id = $(this)
            var d_id
            console.log(drag_id)

            d_id = parseInt(drag_id.attr("id").split("_")[0])

            console.log(parseInt(drag_id.attr("id").split("_")[0]))
            if(d_id>=0){
              console.log("on other")
              $("#overlay").css("visibility","visible")
              $("#vote_prompt").css("visibility", "visible")
              for(var i=0; i<q_sets[d_id]['list'].length; i++){
                $("#v_prompt_box").append("<div id='prompt_"+d_id+"_"+i+"' class='prompt_element'>"+q_sets[d_id]['list'][i]['question']+"</div>")
              }
              $("#v_prompt_box").append("<div id='prompt_gen_q' class='prompt_element'>"+$("#gen_q").text()+"</div>")

              $('.prompt_element').on("mouseover", function(){
                $(this).css("color", "grey")
              }).on("mouseout", function(){
                $(this).css("color", "black")
              }).on("click", function(){
                console.log($(this).parent("div").find(".prompt_element")[0])
                var g_id = parseInt($(this).parent("div").children()[0].id.split("_")[1])
                if($(this).attr("id")=="prompt_gen_q"){

                  generate['num_vote'] =1;

                }else{
                  var q_id = parseInt($(this).attr("id").split("_")[2])
                  dic={}
                  dic['group_id'] = q_sets[g_id]['group_id'];
                  dic['num_vote']= q_sets[g_id]['list'][q_id]['vote']+1
                  dic['question'] = q_sets[g_id]['list'][q_id]['question']
                  dic['id'] = q_sets[g_id]['list'][q_id]['id']
                  back_q.push(dic)

                }
                $("#"+g_id.toString()).off("mouseout").off("mouseover").off("click")
                .droppable("disable").css("color","#e5e5e5")
                generate['group_id']=q_sets[g_id]['group_id'];
                $("#gen_q").draggable("disable").off("mouseout").off("mouseover").css("color","#e5e5e5")
                $("#vote_prompt").css("visibility","hidden")
                $("#overlay").css("visibility","hidden")
                console.log(generate)
                console.log(back_q)
              })
            }
          }
        })

          $("#gen_q").draggable({
            axis: "y",
            helper: "clone",
            revert: "true",

          }).on("dragstart", function(){

          }).on("dragstop", function(){

          })
        }
      }
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
    url: '/crowdsourcer/fetch_q1',
    data: {

    },
    dataType: 'json',
    success: function(data){
      q_sets = JSON.parse(data.question_groups);
      console.log(q_sets)
      for(var i =0; i<q_sets.length; i++){

        var id = q_sets[i]['entity'];
        $("#question_box").append("<div class='entity_q_set' id='set_"+id+"'><div class='entity_q_title' id='title_"+id+"'>"+$("#"+id).attr("title")+"</div><div class='gen_q_sets' id='gen_"+id+"'><div class='gen_q_title'>Your question(s)</div></div><input class='question_type' type='text' id='type"+id+"'><input type='button' id='"+id+"_add' value='Add' class='sbut'>");


        $("#"+id+"_add").on("mouseover", function(){
          $(this).css("color", "green");
        }).on("mouseout", function(){
          $(this).css("color", "black");
        }).on("click", function(){
          addition++;
           var id = $(this).attr("id").substr(0, ($(this).attr("id").length)-4)
           console.log(id)
          //var num = gen_q_num;
          //gen_q_num++;//$(".gen_q").length;
          console.log($("#type"+id).val())
          if($("#type"+id).val()!="" && $("#type"+id).val()!=undefined){
            dic={}
            var id = $(this).attr("id")
            id= id.substr(0,id.length-4)
            console.log(id);
            dic['entity']=id;
            dic['group_id'] = parseInt(gen_q);
            dic['question'] = $("#type"+id).val();
            dic['vote'] = -1;
            gen_q = gen_q-1;
            generate.push(dic);
            console.log(generate)
          //console.log(num)
          $("#gen_"+id).append("<div class='gen_q_set' id='gq_set_"+dic['group_id'].toString()+"'><p class='gen_q' id='gq_"+dic['group_id'].toString()+"'>"+$("#type"+id).val()+"</p><div class='gen_q_buts' id='gq_buts_"+dic['group_id'].toString()+"'><input type='button' value='Del' class='ssbut' id='gq_but_"+dic['group_id'].toString()+"'></div></div>")
          $("#type"+id).val("").focus()
          $("#gq_but_"+dic['group_id'].toString()).on("mouseover", function(){
            $(this).css("color", "red");
          }).on("mouseout", function(){
            $(this).css("color", "black");
          }).on("click", function(){
            console.log(parseInt($(this).attr("id").substr(7)))
            generate = remove_group_id(generate, parseInt($(this).attr("id").substr(7)))
            console.log(generate)
            $(this).parent("div").parent("div").remove();
          })
        }
      })
      }
      $(".entity_q_set").css("visibility", "hidden").css("position","absolute");

  },
    error: function(data){
      alert("Error")
    }
  })
}

gen_entities=function(){
  var n = JSON.stringify(names)
  console.log(n)
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
  back_q.push(generate)
  console.log(back_q)
  // add others

  $.ajax({
    url: '/crowdsourcer/step1_return',
    data: {
      'survey_code' : survey_code,
      'data' : JSON.stringify(back_q),
    },
    dataType: 'json',
    success: function(data){
      job_done_num++;
      if(job_done_num==5){
        window.location.href="/crowdsourcer/end_1/"+survey_code+"/"
      }
      $("#tutorial_pane").text("By clicking entities(shaded ones) in the article, you add entities into your question set. Then you should make a relative question which involves added entities(at least 2 entities should be involved.). You can enter your question in text input(try to make it not causal but relational!) and you can proceed to next by hitting Next button.")
      generate={}
      back_q =[]

      $("a").off("mouseover").off("mouseout").off("click").on("click", function(){
        entity_on_click(this)
      }).on("mouseover", function(){
        $(this).css("background-color", "white")
        .css("border", "solid 1px #e5e5e5")
      }).on("mouseout", function(){
        $(this).css("background-color", "#e5e5e5")
        .css("border", "solid 1px transparent")
      }).css("background-color", "#e5e5e5")
      .css("border", "solid 1px transparent")
      acu_ent_set.push(cur_ent_set)
      cur_ent_set = []
      console.log(acu_ent_set)
      $("#entities_involved").empty()
      $("#question_others").empty()
      $("#question_self").empty()
      $("#type").val("")
      $("#question_others_title").text("")
      $("#v_prompt_box").empty();
      alert("Your answer has been submitted");
      },
    error: function(data){
      alert("Error")
    }
  })
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


tutorial_show = function(){
  $("#tutorial").on("mouseover", function(){

  }).on("mouseout", function(){

  })
}
