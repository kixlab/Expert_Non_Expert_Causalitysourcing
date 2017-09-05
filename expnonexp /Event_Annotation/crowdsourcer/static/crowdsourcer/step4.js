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
$(document).ready(function(e){

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
    $("#tutorial_pane").text("Now you should link related articles with the causal question from novice(which is above the target text in the left). You can search for related articles with keywords. You can add keyword from autocomplete to pane above the autocomplete pane, and related articles that include all keywords will be searched and bd shown in the Related Articles pane. You can take a look at and link articles by clicking them. Linked articles are shown in bold.");
  })
  target_text_ready();
  fetch_causal_question();
  $("#submit").on('click', function(){
    if(linked.length>0){
    Return_data();
  }else{
    alert("Please link at least 1 related articles.")
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

fetch_causal_question = function(){
  $.ajax({
    url: '/crowdsourcer/fetch_causal_question',
    data: {
    },
    dataType: 'json',
    success: function(data){
      causal_question_data = JSON.parse(data.causal_question_data)
      console.log(causal_question_data)
      $("#causal_question").text(causal_question_data['question'])
      if(sub_art==undefined){
      fetch_sub_article();
    }else{
      console.log(sub_art)
      Search_articles();
    }
    },
    error: function(data){
      alert("Error");
    }
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
      for(var i =0; i<sub_art.length; i++){
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
          $("#keyword_text").val("")
          $("#keyword_text").focus()
        }
      })
      Search_articles()
  },
    error: function(data){
      alert("Error")
    }
  })
}

Search_articles=function(){
  $("#search_result").empty();
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
  if(indexes.length!=0){
  for(var i=0; i<indexes.length; i++){
    console.log($(sub_art[indexes[i]]['summary']).find("sup").remove().text())
    $("#search_result").append("<div id='preview_"+indexes[i].toString()+"' class='previews'>"+sub_art[indexes[i]]['summary']+"</div>").find("sup").remove()
    $("#preview_"+indexes[i].toString()).text(sub_art[indexes[i]]['title'])//$("#preview_"+indexes[i].toString()).text().substr(0, 50)+"...")
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
      $("#tutorial_pane").text("After reading the realted article, you can decide whether the shown article is related to the causal question or not. If you think it is related, click Link, and if not, you can go back with Back. If you already linked the article, you can delink the article with Delink button.")
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
          $("#tutorial_pane").text("Now you should link related articles with the causal question from novice(which is above the target text in the left). You can take a look at and link articles in the right pane by clicking them. Linked articles are shown in bold.");

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
          $("#tutorial_pane").text("Now you should link related articles with the causal question from novice(which is above the target text in the left). You can search for related articles with keywords. You can add keyword from autocomplete to pane above the autocomplete pane, and related articles that include all keywords will be searched and bd shown in the Related Articles pane. You can take a look at and link articles by clicking them. Linked articles are shown in bold.");

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
  }}else{
    $("#search_result").text("NO RESULT SEARCHED");
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
    url: '/crowdsourcer/fetch_q1_for_answer',
    data: {

    },
    dataType: 'json',
    success: function(data){
      $("#answer_prompt").text("Write like you are teaching novice.")
      cur_q = JSON.parse(data.a_question)
      console.log(cur_q)
      console.log(cur_q['entity'])
      $("#subject").text($("#"+cur_q['entity']).text());
      $("a").css("background-color","transparent")
      $("#"+cur_q['entity']).css("background-color", "#e5e5e5")
      for(var i=0; i<cur_q['answer_list'].length; i++){
        $("#other_"+(i+1).toString()).text(cur_q['answer_list'][i]['answer'])
      }
      $("#question_box").text(cur_q['question']);
      $("#submit").off('click').on("click", function(){
        if($("#write_pane").val().length>5){
        if(cur_q['answer_list'].length==0){
          console.log("no added answers")
            Return_data();
          }else{
            $("#answer_prompt").text($("#answer_prompt").text()+" You can also improve your text by taking a look at others'.")
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
  sending['q2g_id']=causal_question_data['q2g_id']
  sending['linked']=linked
  console.log(sending)

  // add others

  $.ajax({
    url: '/crowdsourcer/step4_return',
    data: {
      'data' : JSON.stringify(sending),
    },
    dataType: 'json',
    success: function(data){
      console.log("data saved");
      search_entries=[]
      linked=[]
      $("#causal_question").empty()
      $("#key_word_result").empty()
      $("#article_pane").css("visibility","hidden").css("height","0").css("position","absolute")
      $("#searcher").css("visibility", "visible").css("height","100%").css("position","relative")
      fetch_causal_question();
  },
    error: function(data){
      alert("Error")
    }
  })
}
