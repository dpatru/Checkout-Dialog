var editor;

$(document).ready(function(){

  $('form#get_token').live('submit', get_token_form_handler);
  $('form#buy').live('submit', buy_form_handler);
  $('form#send_to_google_checkout').live('submit', send_to_google_checkout_form_handler);
  editor = CodeMirror.fromTextArea(
      "msg", {
	  height: 'dynamic',
	  parserfile: ["parsexml.js"],
	  path: "/codemirror/js/",
	  stylesheet: "/codemirror/css/xmlcolors.css"
      });
  $('h1:not([title])').live('hover', function(){ 
     $(this).attr('title', 'Click to toggle.');
   }).hover();
  $('h1').live('click', function(){$(this).toggleClass('hide_next');});
		      
});

var MERCHANT_ID, MERCHANT_KEY;

function get_token_form_handler(){
  var i = $('[name=merchant_id]', this).val();
  var k = $('[name=merchant_key]', this).val();
  if (i && k) {
      MERCHANT_ID = i;
      MERCHANT_KEY = k;
      $.post('/', $(this).serialize(), get_token_form_cb);
  }
  return false;  
};

function send_to_google_checkout_form_handler(){
  var msg = $('[name=msg]', this).val();
  var url = $('[name=url]', this).val();
  if (msg && url) {
      add_to_dialog(msg, 'sent to '+url);
      $.post('/sender', $(this).serialize(), send_to_google_checkout_form_cb);
  }
  return false;  
};

function send_to_google_checkout_form_cb(reply){
  add_to_dialog(reply, 'Reply from Google Checkout');
};


function get_token_form_cb(token){
  if (!get_socket(token)) return;
  $('form#get_token').addClass('hidden');
  $('#main').removeClass('hidden');
  $('#instructions').html('<h1>Instructions</h1><div><ol><li>Set <a href="https://sandbox.google.com/checkout/sell/settings?section=Integration">google checkout</a> callback to http://'+location.host+'/'+MERCHANT_ID+'/'+MERCHANT_KEY+ '. </li><li>Uncheck box requiring signed carts.</li><li>Check Notification Serial Number radio button.</li></ol></div>');
  particularize();
};
  
function get_socket(token){
  var channel = new goog.appengine.Channel(token);
  var handler = {
    onopen: function(){ alert('opening channel'); },
    onmessage: function(m){
	var ms = m.split('\n', 2);
	add_to_dialog(ms[1], 'Received from '+ms[0]);
    },
    onerror: function(e){
	add_to_dialog(e.description, 'Error getting token '+e.code);
    },
    onclose: function(){ alert('closing channel');}
  };
  var socket = channel.open(handler);
  return socket;
};

function random_char(){
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var r = Math.random();
  return chars[Math.floor(r*chars.length)];
};

function random_string(){
  var a=[];
  for (var i=0; i< 20; i++)
      a[i]=random_char();
  return a.join('');
};

function add_to_dialog(m, title){
    var d;
    var id = random_string();
    d = $('<div><h1>'+title+'</h1><div><textarea id="'+id+'"></div></div>');
    $('#dialog').prepend(d);
    $('#'+id).val(m);
    var editor = CodeMirror.fromTextArea(
      id, {
	  height: 'dynamic',
	  reindentOnLoad: true,
	  readOnly: true,
	  parserfile: ["parsexml.js"],
	  path: "/codemirror/js/",
	  stylesheet: "/codemirror/css/xmlcolors.css"
      });

    return;
    d = $('<div>').append($('<pre>').text(m));
    $('#dialog').prepend(d);
    
    d = $('<div>');
    $('#dialog').prepend(d);
    hilite(m, d[0]);
    return;
    m = $.map(m.split('\n'), to_html).join('<br>');
    $('#dialog').prepend($('<div>').html(m));
};

function to_html(t){
    return $('<div>').text(t).html();
};

function particularize(){
  var src = 'https://sandbox.google.com/checkout/buttons/buy.gif?merchant_id=' +
	MERCHANT_ID +
	'&w=121&h=44&style=white&variant=text&loc=en_US';
  $('#buynow_button').attr('src', src);

  $('input[type=hidden][name=merchant_key]').val(MERCHANT_KEY);
  $('input[type=hidden][name=merchant_id]').val(MERCHANT_ID);

  src = 'https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/' + MERCHANT_ID;
  $('form#buy').attr('action', src);
};

function buy_form_handler(){
  $('[name=item_name_1]', this).val('Item submitted '+(new Date));
};

function hilite(s,d){
  return highlightText(s, d, XMLParser);
};