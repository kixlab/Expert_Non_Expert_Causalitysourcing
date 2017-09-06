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
var sub_art;
var tot_entities=[];
var search_entries=[];

var linked=[];

var causal_question_data;
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
  $("#cancel").on("mouseover", function(){
    $(this).css("color", "red")
  }).on("mouseout", function(){
    $(this).css("color", "black")
  }).on("click", function(){
    $("#article_pane").css("visibility","hidden").css("height","0").css("position","absolute")
    $("#searcher").css("visibility", "visible").css("height","100%").css("position","relative")
  })
  target_text_ready();
  fetch_sub_article();

  $("#submit").on('click', function(){
    if($("#interpret_input").val().length>7){
    Return_data();
  }else{
    alert("Please write your interpretation.")
  }

  })

})

target_text_ready = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_target_text',
    data: {
    },
    dataType: 'json',
    success: function(data){

      title = data.title;
      $("#target_title").text("Target article : "+title)
      summary = data.summary;
      $("#target_summary").append(summary)
      $("sup").remove();
      $("a").css("background-color", "#e5e5e5")
      .css("border", "solid 1px transparent").attr("id", function(){
        names.push($(this).attr("title"))
        ids.push($(this).attr("title").replace(/ /gi, "_").split("(")[0])
        return  $(this).attr("title").replace(/ /gi, "_").split("(")[0]})
      .attr("href", function(){return "javascript:"}).attr("class", "target_entity")

      //gen_entities();

      $("#submit").on("mouseover", function(){
        $(this).css("color", "green");
      }).on("mouseout", function(){
        $(this).css("color", "black");
      })
      fetch_questions();
  },
    error: function(data){
      alert("Error")
    }
  })
}

fetch_causal_question = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_causal_question_step5',
    data: {
      'done_q' : JSON.stringify(done_q)
    },
    dataType: 'json',
    success: function(data){
      if(!data.end){
      $("#related_result").empty();
      $("#article_box").empty();
      causal_question_data = JSON.parse(data.causal_question_data)
      console.log(causal_question_data)
      $("#causal_question").text(causal_question_data['question'])
      var linked_article_list = causal_question_data['linked_article_list']
      for(var i=0; i<linked_article_list.length; i++){
        var sum_text;
        for(var j=0; j<sub_art.length; j++){
          if(linked_article_list[i]==sub_art[j]['title']){
            sum_text=sub_art[j]['summary']
            break;
          }
        }
        $("#related_result").append("<div id='preview_"+i.toString()+"' class='rel_art_prev'>"+sub_art[i]['title']+"</div>").find("sup").remove()
      //  $("#preview_"+i.toString()).text($("#preview_"+i.toString()).text().substr(0, 50)+"...")
      //  console.log("this is sumtext", sum_text)
      }
      reset_related_articles();
    }else{
      var sp_href = window.location.href.split("_")
      console.log(sp_href)
      var mark = sp_href[sp_href.length-1]
      if(mark.includes("n")){
        window.location.href = "/crowdsourcer/end_n5"

      }else if(mark.includes("e")){
        window.location.href = "/crowdsourcer/end_e5"  
      }
    }
  },
    error: function(data){
      alert("Error");
    }
  })
}

reset_related_articles = function(){

  $(".rel_art_prev").css("font-weight","normal").css("border", "solid 1px transparent").off("mouseover").off("mouseout").off("click")
  .on("mouseover", function(){
    var id = parseInt($(this).attr("id").split("_")[1])
    var title = causal_question_data['linked_article_list'][id]
    console.log(title)
    var sum_text;
    for(var j=0; j<sub_art.length; j++){
      if(title==sub_art[j]['title']){
        sum_text=sub_art[j]['summary']
        break;
      }
    }
      $("#article_box").append(sum_text).find("sup").remove()
      $("#article_box").find("a").attr("href", "javascript:")
    $(this).css("border", "solid 1px black")
  })
  .on("mouseout", function(){
    $("#article_box").empty();
    $(this).css("border", "solid 1px transparent")
  }).on("click", function(){
    related_articles_onclick(this)
  })
}

related_articles_onclick = function(t){
  var id = parseInt($(t).attr("id").split("_")[1])
  var title = causal_question_data['linked_article_list'][id]
  console.log(title)
  var sum_text;
  for(var j=0; j<sub_art.length; j++){
    if(title==sub_art[j]['title']){
      sum_text=sub_art[j]['summary']
      break;
    }
  }
  $("#article_box").empty().append(sum_text).find("sup").remove()
  $("#article_box").find("a").attr("href", "javascript:")
  $(".rel_art_prev").css("font-weight", "normal").off("mouseover").off("mouseout").off("click")
  .on("click", function(){
    $(this).css("border", "solid 1px black")
    related_articles_onclick(this);
  })
  $(t).css("font-weight", "bold").on("mouseout", function(){
    $(this).css("border", "solid 1px transparent")
  }).on("mouseover", function(){
    $(this).css("border", "solid 1px black")
  }).on("click", function(){
    reset_related_articles();
  })
}

fetch_sub_article = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_sub_text',
    data: {
    },
    dataType: 'json',
    success: function(data){
      sub_art = JSON.parse(data.texts)
      console.log(sub_art)
      fetch_causal_question();
      /**for(var i =0; i<sub_art.length; i++){
        sub_art[i]['entity_list']=[]
        $("#empty").empty()
        $("#empty").append(sub_art[i]['summary'])
        $("#empty").find("a").css("visibility", function(){
          if($(this).attr("title")!=undefined){
          sub_art[i]['entity_list'].push($(this).attr("title"))
          if(!tot_entities.includes($(this).attr("title"))){
            tot_entities.push($(this).attr("title"));
          }
        }
        })
      }
      $("#empty").css("visibility", "hidden").css("height", "0")
      console.log(sub_art)
      console.log(tot_entities)
      $("#keyword_text").autocomplete({
        source: tot_entities
      })
      $("#add").on("mouseover", function(){
        $(this).css("color", "green")
      }).on("mouseout", function(){
        $(this).css("color", "black")
      }).on("click", function(){
        var inp=$("#keyword_text").val()
        if(!tot_entities.includes(inp)){
          alert("Please enter entity from autocomplete")
        }else if(search_entries.includes(inp)){
          alert("It already exists in entry")
        }else{
          search_entries.push(inp)
          var index = tot_entities.indexOf(inp)
          $("#key_word_result").append("<div class='entity_box' id='box_"+index.toString()+"'>"+inp+"</div>")
          $("#box_"+index.toString()).on("mouseover", function(){
            $(this).css("color", "red")
          }).on("mouseout", function(){
            $(this).css("color","black")
          }).on("click", function(){
            var index = parseInt($(this).attr("id").split("_")[1])
            var idx = search_entries.indexOf(tot_entities[index])
            search_entries.splice(idx,1)
            $(this).remove()
            //TODO search
            Search_articles()
            console.log(search_entries)
          })
          //TODO search
          Search_articles()
        }
      })
      Search_articles()**/
  },
    error: function(data){
      alert("Error")
    }
  })
}

Search_articles=function(){
  $("#related_result").empty();
  var searched_articles=[];
  var indexes = Array.apply(null, {length: sub_art.length}).map(Number.call, Number)

  for (var i =0; i<search_entries.length; i++){
    var cur_key = search_entries[i]
    for(var j=0; j<indexes.length; j++){
      if(!sub_art[indexes[j]]['entity_list'].includes(cur_key)){
        indexes.splice(j,1)
      }
    }
  }
  for(var i=0; i<indexes.length; i++){
    console.log($(sub_art[indexes[i]]['summary']).find("sup").remove().text())
    $("#related_result").append("<div id='preview_"+indexes[i].toString()+"'>"+sub_art[indexes[i]]['summary']+"</div>").find("sup").remove()
    $("#preview_"+indexes[i].toString()).text($("#preview_"+indexes[i].toString()).text().substr(0, 50)+"...")
    if(causal_question_data['linked_article_list'].includes(sub_art[indexes[i]]['title'])){
      $("#preview_"+indexes[i].toString()).css('background-color', 'grey');
    }
    if(linked.includes(sub_art[indexes[i]]['title'])){
      $("#preview_"+indexes[i].toString()).css('font-weight', 'bold');
    }
    $("#preview_"+indexes[i].toString()).css('border', "solid 1px transparent").on("mouseover", function(){
      $(this).css('border', "solid 1px black")
    }).on("mouseout", function(){
      $(this).css('border', 'solid 1px transparent')
    }).on("click", function(){
      var sub_art_id = parseInt($(this).attr("id").split("_")[1])
      if(!linked.includes(sub_art[sub_art_id]['title'])){
        $("#link").val("Link").css("color", "black").off("mouseover").off("mouseout").off("click")
        .on("mouseover", function(){
          $(this).css("color", "green")
        }).on("mouseout", function(){
          $(this).css("color", "black")
        }).on("click", function(){
          console.log($("#article").attr("name"))
          linked.push(sub_art[parseInt($("#article").attr("name"))]['title'])
          console.log(linked)
          Search_articles()
          $("#article_pane").css("visibility","hidden").css("height","0").css("position","absolute")
          $("#searcher").css("visibility", "visible").css("height","100%").css("position","relative")
        })
      }else{
        $("#link").val("DeLink").css("color", "black").off("mouseover").off("mouseout").off("click")
        .on("mouseover", function(){
          $(this).css("color", "red")
        }).on("mouseout", function(){
          $(this).css("color", "black")
        }).on("click", function(){
          var index = linked.indexOf(sub_art[parseInt($("#article").attr("name"))]['title'])
          linked.splice(index, 1)
          console.log(linked)
          Search_articles()
          $("#article_pane").css("visibility","hidden").css("height","0").css("position","absolute")
          $("#searcher").css("visibility", "visible").css("height","100%").css("position","relative")
        })
      }

      $("#searcher").css("height", "0").css("visibility", "hidden").css("position", "absolute")
      $("#article_pane").css("height", "100%").css("visibility", "visible").css("position", "relative")
      $("#article").empty()
      $("#article").attr('name', sub_art_id)
      $("#article").append(sub_art[sub_art_id]['summary'])
      $("#article").find("sup").remove()
      $("#article").find("a").attr("href", "javascript:")
    })
  }
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
    url: '/crowdsourcer/fetch_q_a_step3',
    data: {

    },
    dataType: 'json',
    success: function(data){
      q_sets=JSON.parse(data.q_a_set);
      console.log(q_sets)
      for(var i=0; i<q_sets.length; i++){
        var sub_enti=q_sets[i]
        id = sub_enti['entity']
        if(sub_enti['question_group'].length!=0){


          $("#qna_content").append("<div class='entity_q_set' id='set_"+id+"'><div class='entity_q_title' id='title_"+id+"'>"+$("#"+id).attr("title")+"</div>");
          for(var j=0; j<sub_enti['question_group'].length; j++){
            var q = sub_enti['question_group'][j]
            $("#set_"+id).append("<div class='q_a_set' id='"+id+"_"+j.toString()+"' name='"+i.toString()+"'></div>")
            $("#"+id+"_"+j.toString()).append("<div class='q'>Q : "+q['question']+"</div><div class='a'>A : "+q['answer']+"</div>")
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
              $("a").css("border", "solid 1px transparent")
              $(this).css("background-color", "transparent")
            })
          }
          entity_question_reset();
          $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")
        }else{
          $("#"+id).attr("class", "").css("background-color","transparent").off("mouseout").off("mouseover").off("click")
        }
      }
      //$(".entity_q_set").css("visibility", "hidden").css("position", "absolute").off("mouseover").off("mouseout").off("click")

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

entity_question_reset = function(){
  $(".target_entity").css("font-weight", "normal").on("mouseover", function(){
    $(".target_entity").css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
    $(".entity_q_set").css("visibility", "hidden").css("position","absolute")
    $(this).css("background-color", "white")
    .css("border", "solid 1px #e5e5e5")
    $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")

    $("#set_"+$(this).attr('id')).css("visibility", "visible").css("position","static")
  }).on("mouseout", function(){
    $(this).css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
    $("#set_"+$(this).attr('id')).css("visibility", "hidden").css("position","absolute")
  }).on("click", function(){
    entity_question_click(this)
  })
}
entity_question_click = function(t){

  $(".entity_q_set").css("visibility", "hidden").css("position", "absolute")
  $(".target_entity").off("mouseout").off("mouseover").off("click").css("font-weight", "normal")
  .on("click", function(){
    entity_question_click(this)
  })
  $(t).css("background-color", "white").css("border", "solid 1px #e5e5e5").css("font-weight", "bold").on("mouseout", function(){
    $(this).css("background-color", "#e5e5e5")
    .css("border", "solid 1px transparent")
  }).on("mouseover", function(){
    $(this).css("background-color", "white")
    .css("border", "solid 1px #e5e5e5")
  }).off("click").on("click", function(){
    entity_question_reset()
  })
  $("#set_"+$(t).attr("id")).css("visibility", "visible").css("position", "static")

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
  var sp_href = window.location.href.split("_")
  console.log(sp_href)
  var mark = sp_href[sp_href.length-1]
  if(mark.includes("n")){
    sending['is_expert']=false;
  }else if(mark.includes("e")){
    sending['is_expert']=true;
  }
  done_q.push(causal_question_data['q2g_id'])
  sending['q2g_id']=causal_question_data['q2g_id']
  sending['interpretation']=$("#interpret_input").val()
  console.log(sending)

  // add others

  $.ajax({
    url: '/crowdsourcer/step5_return',
    data: {
      'data' : JSON.stringify(sending),
    },
    dataType: 'json',
    success: function(data){
      alert("Your interpretation is returned!")
      console.log("data saved");
      $("#interpret_input").val("")
      fetch_causal_question();

  },
    error: function(data){
      alert("Error")
    }
  })
}
