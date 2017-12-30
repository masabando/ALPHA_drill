
var qlist = {
  dec: [],
  decx: [],
  nondec: [],
  calctable: [],
  radixtable: [],
  angletable: [],
  memory_m: [],
  memory_x: []
};

function alpha_drill() {
  var APP_NAME = 'alpha_drill.js';
  var VERSION = "0.1";

  var content = $('#alpha_drill');
  var question_container = $('#question_container')
  var question;
  var footer = $('#footer');
  var header = $('#header');
  var digit_size = 8;// 4*N
  var digit_msize = 4;// 4*M < digit_size
  var proc_list = [['+', "+"], ['-', "-"], ['\\times', "*"], ['\\div', "/"]];
  var qnum = {
    dec: 15,
    decx: 6,
    nondec: 10,
    calctable: 10,
    radixtable: 10,
    angletable: 10,
    memory_m: 10,
    memory_x: 10
  };

  // [Autoset Vars] ---------------------------------------------------
  var click_event = 'click';
  var smart_phone_flag = false;
  var num_range = {max: Math.pow(2,digit_size - 1) - 1,
                   min: -Math.pow(2,digit_size - 1)};
  var zfillstr = Array(digit_size + 1).join("0");
  var mathjaxstr = "";
  // [for smart phone] ------------------------------------------------
  function agent_checker() {
    var agent = navigator.userAgent;
    if(agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1
       || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1) {
      smart_phone_flag = true;
      click_event = "touchend";
      // $(window).on('touchmove', function(e) { e.preventDefault(); });
    }
    if (smart_phone_flag) {
      mathjaxstr = "\\large";
    }
  }
  // ------------------------------------------------------------------

  function get_rand_int(min, max) {
    return Math.floor((max - min + 1)*Math.random() + min);
  }

  function get_rand_mathfunc() {
    switch(get_rand_int(0,5)) {
    case 0: // 12.34^{5}
      return get_rand_float(-9,9,2) + '^{' + get_rand_int(2,5) + '}';
    case 1: // e^{3.1}
      return 'e^{' + get_rand_float(0.2,4,1) + '}';
    case 2: // \pi^{3.1}
      return '\\pi^{' + get_rand_float(0.2,4,1) + '}';
    case 3: // sqrt{1.23}
      return '\\sqrt{' + get_rand_float(1,9,2) + '}';
    case 4:
      return '\\sin(' +  + ')';
    }
  }

  function get_rand_float(min, max, dp) {
    return float_format((max - min)*Math.random() + min, dp);
  }

  function float_format(val, len) {
    if (("" + val).split(".").length == 2) {
      var a = (val + Array(len).join("0")).split(".");
      return a[0] + "." + a[1].slice(0,len);
    } else {
      return val + "." + Array(len).join("0");
    }
  }

  function round_float(val, len) {
    var v = Math.round(val*(Math.pow(10,len)));
    var a = "" + v;
    var p = a.slice(0,-len);
    var b = (v < 0 ? "-" : "") + Math.abs(p == "-" ? 0 : p);
    var c = (Array(len).join("0") + Math.abs(a.slice(-len))).slice(-len);
    return b + "." + (c.length < len ? c + Array(len - c.length).join("0") : c);
  }

  function zerofill(str, len) {
    return (zfillstr + str).slice(-len);
  }

  function get_random_bin() {
    var a = Array.apply(null, Array(digit_size))
      .map(function() { return get_rand_int(0,1); });
    a.splice(4, 0, " ");
    return a.join("");
  }

  function bin2hex(s) {
    return parseInt(s.substr(0, 4), 2).toString(16)
      + (s.charAt(4) === " " ? "" : ".")
      + parseInt(s.substr(5, 4), 2).toString(16);
  }

  function bin2dec(s) {
    if (s.charAt(4) === " ") {// 整数
      if (parseInt(s.charAt(0)) == 0) {// 正の整数
        return parseInt(s.substr(0, 4) + s.substr(5, 4), 2).toString(10);
      } else {// 負の整数
        b = add1(bitflip(s));
        return (-parseInt(b.substr(0, 4) + b.substr(5, 4), 2)).toString(10);
      }
    } else {// 小数
      if (parseInt(s.charAt(0)) == 0) {// 正の小数
        return parseInt(s.substr(0, 4), 2).toString(10)
          + '.'
          + ((parseInt(s.substr(5, 4), 2)*Math.pow(0.5, 4))
             .toString(10).split(".")[1] || "0");
      } else {// 負の小数
        var b = add1(bitflip(s));
        return '-' + parseInt(b.substr(0, 4), 2).toString(10)
          + '.'
          + ((parseInt(b.substr(5, 4), 2)*Math.pow(0.5, 4))
          .toString(10).split(".")[1] || "0");
      }
    }
  }

  function add_hook_event() {
    $('.qinput').change(function() {
      var n, t, x;
      if (smart_phone_flag) {
        x = $(this).parent().parent().attr('id').split("_");
      } else {
        x = $(this).parent().attr('id').split("_");
      }
      n = x[x.length-1];
      t = x[x.length-2];
      var user_ans = $(this).val();
      var ans = qlist[t][n].ans;
      var ansx = qlist[t][n].ans;
      if (t == "" && ans.length == 9 && ans.charAt(4) === ' ') {
        ansx = ans.substr(0,4) + ans.substr(5,4);
      }
      if (ans === user_ans || ansx === user_ans) {
        $('.question').eq(n).css('background', '#aaf');
      } else {
        $('.question').eq(n).css('background', '#fff');
      }
    });
  }

  var total_qnum = 0;
  function create_question(key, qi) {
    var q = {qst: false, ans: false};
    var proc, v;
    total_qnum++;
    switch(key) {
    case 'dec':
      var knum = get_rand_int(3,4);
      q.qst = get_rand_float(-99,99, 2);
      q.ans = q.qst;
      for (var i=1; i < knum; i++) {
        proc = get_rand_int(0,3);
        v = get_rand_float(-99,99, 2);
        q.qst += " " + proc_list[proc][0] + " " + v;
        q.ans += " " + proc_list[proc][1] + " " + v;
      }
      q.ans = round_float(eval(q.ans),2);
      qlist.dec.push(q);
      $('#q_dec').append(
        '<div class="question" id="question_dec_' + qi + '">'
          + '<div class="qid">' + (qi < 10 ? '&ensp;' : '') + total_qnum + ':</div>'
          + '<div class="qst">\\({' + mathjaxstr + " " + q.qst + ' =}\\)</div>'
          + (smart_phone_flag ? '<div class="right">': '')
          + '<input class="qinput" type="text" name="qinput" value="">'
          + (smart_phone_flag ? '</div>': '')
          + '<div class="qans">(' + q.ans + ')</div>'
          + '</div>'
      );
      break;
    }
  }

  function init() {
    agent_checker();
    footer.html(APP_NAME + " -- v." + VERSION);
    $("#question_container > div").html("");
    $.each(qnum, function(k, v) {
      for (var i=0; i < v; i++) { create_question(k, i); }
    });
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    add_hook_event();
  }

  function go() {
    init();
    //show_answers();
  }

  go();
}

function show_answers() { $('.qans').css('visibility', 'visible'); }

function hide_answers() { $('.qans').css('visibility', 'hidden'); }

var print_mode_ans = false;
function print_mode(num) {
  print_mode_ans = !print_mode_ans;
  var nstr = ("0"+num).slice(-2);
  if (print_mode_ans) {
    $('.qinput').each(function() {
      $(this).val(qlist[$(this).parent().attr('id').split('_')[1]].qans);
    });
    $('#printnum').html(nstr + " 解答");
    $('title').text(nstr + "_ans");
  } else {
    $('.qinput').val("");
    $('#printnum').html(nstr);
    $('title').text(nstr);
  }
  $('.qans').css('display', 'none');
}

$(function() {
  alpha_drill();
});
