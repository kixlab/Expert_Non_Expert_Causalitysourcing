var max_num_of_art;

var date1, date2;

var sentence_state_sub_ft_r = []
var sentence_state_sub_ft_n = []
var prev_text;

var other_state_sub_ft_r = []
var other_state_sub_ft_n = []

var green_font = "rgb(40,175,65)"//[40, 175, 65];
var red_font = "#db003e" //"rgb(198, 33, 55)"//[198, 33, 55];
var gray_font = "#d18b00"

var session_type = 0 // 0: sieve 1/ 1: sieve 2/ 2: sieve 3/ 3: verify

var link_start_id=-1;

var item_num=0;

var key_id;

var sub_id;
var worker_id;
var prev_id;
var weekday = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
//var userid=prompt("Please enter your name", "none");

color_calculator = function(deg){
  color ="rgb("
  for (var i =0; i<3; i++){
    color = color+parseInt((green_font[i] * deg + red_font[i] * (1-deg))).toString()
    if (i!= 2){
      color = color+", "
    }else{
      color = color +")"
    }
  }
  return color;
}

$(document).ready(function(e){
$(window).bind("unload", function(){

})
  $("#evidence_box").css("visibility", "hidden").css("height", "0")

  if(window.location.href.includes("sieve1")){
    session_type=0
    lh =$(".title").height();
    $("#instruction").text("After reading the review, decide whether the review is spurious or not.")
    $("#overlay").css("visibility","hidden")
    /**$("#texts").css("height","13.5%")
    $("#p_title_text").css("padding-top","100px")
    $(".header").css("height","100%")
    $(".title").css("text-align", "center");
    $(".header").css("border-bottom", "solid 1px black").css("border-bottom-left-radius", "20px").css("border-bottom-right-radius", "20px")
    $("#texts").css("margin-bottom", "20px")**/
  }else if(window.location.href.includes("sieve2")){
    $("#instruction").text("After reading summaries of the changing articles(left) and the fixed article(right), decide whether they are related or not.")
    $("#overlay").css("visibility","hidden")
    $(".full_text").css("visibility", "hidden").css("height","0")
    $(".summary").css("height","100%")
    $(".summary").css("border-bottom", "solid 1px black").css("border-bottom-left-radius", "20px").css("border-bottom-right-radius", "20px")

    session_type=1
  }else if(window.location.href.includes("veri_con")){
    session_type=2
    lh =$(".title").height();
    $("#instruction").text("After reading the review, decide whether the review is spurious or not.")
    $("#overlay").css("visibility","hidden")
  }else if(window.location.href.includes("verify")){
    $("#instruction").text("After reading the review, decide whether the review is spurious or not. Opinion of previous workers can be also shown if you put your mouse on colored sentences.")
    $("#overlay").css("visibility","hidden")
    session_type=3
  }

  prev_text = $("#instruction").text();
  infos = window.location.href.split("/");

  sub_id = parseInt(infos[5])
  worker_id = parseInt(infos[6])
  prev_id = parseInt(infos[4])
  console.log(infos)
Session_Create();
  Button_set_up();

})

Button_set_up = function(){
  $("#instruction").text(prev_text);
  $(".text_sentence").off("mouseover").off("click").css("background-color", "transparent")
  $("#relation").text("Related");
  $("#nothing").text("Not Related");
  $(".button").on('mouseover',function(){
    var backcolor;
    if($(this).attr('id')=="relation"){
      backcolor = "#4ad377";

    }else if($(this).attr('id')=="nothing"){
      backcolor = "#e8536c";

    }
    $(this).css("background-color", backcolor);
  }).on('mouseout',function(){
    var backcolor;
    if($(this).attr('id')=="relation"){
      backcolor = "#a8ddba";
    }else if($(this).attr('id')=="nothing"){
      backcolor = "#f7c8d0";
    }
    $(this).css("background-color", backcolor);
  }).on('mousedown',function(){
    var backcolor="#e0e0e0";
    $(this).css("background-color", backcolor);
  }).on('mouseup',function(){
    var backcolor;
    if($(this).attr('id')=="relation"){
      backcolor = "#4ad377";
    }else if($(this).attr('id')=="nothing"){
      backcolor = "#e8536c";
    }
    $(this).css("background-color", backcolor);
  }).off('click').on('click', function(){
    var button_type=0;
    var status;
    if($(this).attr('id')=="relation"){
      button_type = 1;
    }else if($(this).attr('id')=="nothing"){
      button_type = 2;
    }
    status = button_type;
    Button_set_up2(status)

  })

  Initialize_Interactive_sent();
}

Button_set_up2 = function(status){
  $("#instruction").text("You can select sentences as evidence that support your decision.")
  var mouseovercolor;
  if(status==1){
    mouseovercolor = "#d4f9cc"
  }else if(status==2){
    mouseovercolor ="#ffe2ef"
  }

  $(".text_sentence").css("pointer-events", "all").on("mouseover", function(){
    $(this).css("background-color", mouseovercolor)
  }).on("mouseout", function(){
    $(this).css("background-color", "transparent")
  }).on("click", function(){
    var state_type;
    var id_t = $(this).attr("id")

    if(id_t.includes("sub_ft")){
      if(status == 1){
        state_type = sentence_state_sub_ft_r
      }else if(status == 2){
        state_type = sentence_state_sub_ft_n
      }
    }
    var id = parseInt(id_t.split("_")[1])

    console.log(state_type[id])
    if(state_type[id]==0){
      state_type[id]=1
      $(this).off("mouseout")
    }else{
      state_type[id] =0
      $(this).on("mouseout", function(){
        $(this).css("background-color","transparent")
      })
    }
    if(id_t.includes("sub_ft")){
      if(status == 1){
        sentence_state_sub_ft_r = state_type
      }else if(status == 2){
        sentence_state_sub_ft_n = state_type
      }
    }

  })
  $(".text_sentence").css("background-color", function(){
    var id_t = $(this).attr("id")
    var state_type;
    if(status == 1){
      if(id_t.includes("sub_ft")){
        state_type = sentence_state_sub_ft_r
      }
    }else if (status ==2){
      if(id_t.includes("sub_ft")){
        state_type = sentence_state_sub_ft_n
      }
    }
    var id = parseInt(id_t.split("_")[1])
    if(state_type[id]==1){
      $(this).off("mouseout");
      return mouseovercolor;
    }
  })
  $("#relation").text("Submit").off('click').on('click', function(){
    if(status == 1){
        //alert(sentence_state_key_sum_r)
        Return_data(status, sentence_state_sub_ft_r);
    }else if(status ==2){
      Return_data(status, sentence_state_sub_ft_n);
    }
  })
  $("#nothing").text("Go Back").off('click').on('click', function(){
    Button_set_up();
    console.log("heh");
  })
  //$(".button").
}

Session_Create = function(button_type){
  $.ajax({
    url: '/crowdsourcer/data_fetch',
    data: {
      'sub_id' : sub_id,
    },
    dataType: 'json',
    success: function(data){
      max_num_of_art = parseInt(data.sub_art_num);
      console.log(max_num_of_art)
      $("#p_title_text").text(data.sub_title);


      $("#n_date").text(data.sub_date);
      Sentence_appender(data.sub_full_text, "#p_ft","_sub_ft")

    /*  if(session_type==1 || session_type==3){
      Sentence_appender(data.sub_summary, "#p_sum_text","_sub_sum")
      Sentence_appender(data.key_summary, "#n_sum_text", "_key_sum")
    }
    if(session_type==3){
      Sentence_appender(data.sub_full_text, "#p_ft", "_sub_ft")
      Sentence_appender(data.key_full_text, "#n_ft", "_key_ft")
    }
    if(session_type == 2){
      Sentence_appender(data.sub_full_text, "#p_ft", "_sub_ft")
      Sentence_appender(data.key_summary, "#n_sum_text", "_key_sum")
      Sentence_appender(data.key_full_text, "#n_ft", "_key_ft")
    }**/
    Initialize_Interactive_sent();
  },
    error: function(data){
      alert("fail");
    }

  });
}

Initialize_Interactive_sent = function(){
  if(window.location.href.includes("verify")){
    console.log("verification is approved")
    $(".text_sentence").css("pointer-events", "all").off("mouseover").on("mouseover", function(){
      var r_counts, n_counts;

      var id_t = $(this).attr("id")
      var id = parseInt(id_t.split("_")[1])
      if (id_t.includes("sub_ft")){
        r_counts = other_state_sub_ft_r;
        n_counts = other_state_sub_ft_n;
      }
      if(r_counts[id]!=0 || n_counts[id]!=0){
      $("#instruction").css("visibility", "hidden").css("height", "0");
      $("#evidence_box").css("visibility", "visible")//.css("height", "100%");

      console.log(id)
      if(r_counts[id]>0){
      $("#R_support").text("People thought this sentence is an evidence that the review is truthful.")
    }else{
      $("#R_support").text("");
    }
    var addi="";
    if(r_counts[id]>0 && n_counts[id]>0){
      addi = " also"
    }
    if(n_counts[id]>0){
      $("#N_support").text("People"+addi+" thought this sentence is an evidence that the review is deceptive.")
    }else{
      $("#N_support").text("");
    }
  }

    }).off("mouseout").on("mouseout", function(){
      $("#instruction").css("visibility", "visible");
      $("#evidence_box").css("visibility", "hidden").css("height", "0")
    }).css("color", function(){
      var r_counts, n_counts;

      var id_t = $(this).attr("id")
      var id = parseInt(id_t.split("_")[1])
      if (id_t.includes("sub_ft")){
        r_counts = other_state_sub_ft_r;
        n_counts = other_state_sub_ft_n;
      }
      console.log(r_counts[id])
      console.log(n_counts[id])
      if(r_counts[id]==0 && n_counts[id]==0){
        return "black";
      }else{
        if(r_counts[id]>0 && n_counts[id]==0){
          return green_font;
        }else if (r_counts[id]==0 && n_counts[id]>0){
          return red_font;
        }else{
          return gray_font;
        }
      //var deg = parseFloat(r_counts[id])/parseFloat(r_counts[id]+n_counts[id])
      //console.log(color_calculator(deg))
      //return color_calculator(deg);
    }
    });
    console.log("verification is approved")
  }
}
Sentence_appender =function(sentences, id, is_key){
  sentences = sentences.sort(function(a, b){
    return a.sequence-b.sequence;
  })
  //console.log(sentences)

  // lazy version
  text = ""
  for (var i =0; i<sentences.length; i++){
    text = text+" "+'<a href="'+"javascript:"+'"+ class="text_sentence" id="sen_'+i.toString()+is_key+'">'+sentences[i].sentence+"</a>"
    if(is_key =="_sub_ft"){
      console.log("adding")
      sentence_state_sub_ft_r.push(0)
      sentence_state_sub_ft_n.push(0)
      other_state_sub_ft_n.push(parseInt(sentences[i].evidence_N))
      other_state_sub_ft_r.push(parseInt(sentences[i].evidence_R))
    }
  }
  $(id).append(text);
}
Return_data = function(status, sentence_state_sub_ft){

  sssf = JSON.stringify(sentence_state_sub_ft)
  $.ajax({
    url: '/crowdsourcer/return_data',
    data: {

      'sub_id' : sub_id,
      'status' : status,
      'session_type' : session_type,
      'sentence_state_sub_ft' : sssf,

    },
    dataType: 'json',
    success: function(data){
      console.log(data.rd)
      window.location.href = data.rd;
  },
    error: function(data){
      alert("Error")
    }

  });
}
