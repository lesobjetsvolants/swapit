
"use strict";

var colors=['#009900','#006600'];
var color=0;
// mysteriously didn't manage to make these variables 
// properties of caret;
// let them global instead
var caret={
		pos:0,
		timer:null,
		color:0,
		change_color:function()
		{
			color=1-color;
			if (document.getElementById('caret'))
				document.getElementById('caret')
								 .style.backgroundColor=colors[color];
		},
		blink:function()
		{
			clearTimeout(this.timer);
			color=0;
			if (document.getElementById('caret'))
				document.getElementById('caret')
								 .style.backgroundColor=colors[color];
			this.timer=setInterval(this.change_color,500);
		},
		set:function()
		{
			if (this.pos>=0)
			document.getElementById('highlight')
							 .children[this.pos]
							 .id='caret';
			this.blink();
		}
};

var style={
	OK:'color:white',
	ERROR:'color:red',
	TAG:'color:#99CC99',
	TOOMANYLANDINGS:'color:#FF6666;text-decoration:underline',
	NOTENOUGHLANDINGS:'color:#CC9999;text-decoration:underline',
	COMMENT:'color:#888888',
	EXTENSION:'color:#9999FF',
};

var serialize={
	FULL:					0b1111111,
	NOEXTENSION:	0b0000010,
};

function QueryString()
{
	var t='';
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++)
	{
    var pair = vars[i].split("=");
        // If first entry with this name
    if (pair[0]=='text')
			query=decodeURIComponent(pair[1]);
  } 
  return query;
}

function display(e)
{
	document.getElementById(e+'-'+localtext.lang)
					 .style.visibility='visible';
}

function hide(e)
{
	document.getElementById(e).style.visibility='hidden';
}

function highlight_scroll()
{
	document.getElementById('highlight')
					 .scrollTop = document.getElementById('inputsiteswap')
																 .scrollTop;
}

function dump(o,level)
{
  var result='';
	var level_padding='';
	var line_break='<br>';

  if (!level) level=0;
  for (var j=0;j<level+1;j++)
    level_padding+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
  if (typeof o=='object')
    for (var item in o)
    {
      var value=o[item];
      if (typeof value =='object')
        result+=level_padding+item
                +line_break
                +dump(value,level+1);
      else if (typeof value!='function')
			{
				result+=level_padding+item
                +' => ';
				if (value==null)
					result+='null';
				else
					result+=value.toString().substr(0,50)
                +' ('+typeof value +')';
				result+=line_break;
			}
    }
  else
	{
		if (o==null)
			result+='null';
		else
			result+=o+' ('+typeof(o)+')'+line_break;
	}
  return result;
}

function debug_output()
{
	var result='';
	for (var i in arguments)
	{
		if (typeof(arguments[i])=='object')
			result+=arguments[i][localtext.lang];
		else
			result+=arguments[i];
  }
	document.getElementById('debug').innerHTML+=result;
}

function error_output()
{
	debug_output(localtext.error.error);
	for (var i in arguments)
		debug_output(arguments[i]);
	debug_output('<br>');
	colorize(n,style.ERROR);
	score.error_detected=true;
}

function convert_to_html(s)
{
  if (s) return s.replace(' ','&nbsp;')
					 .replace('<','&lt;')
					 .replace('>','&gt;')
					 .replace('\n','&nbsp;<br>')
					 ;
	else return '';
}

function colorize(string_index,style,callid)
{
	var hl=document.getElementById('highlight');
	// console.log('colorize string_index=',string_index,'call id=',callid);
	var mynode=document.createElement('span');
	mynode.innerHTML=convert_to_html(user_input[string_index]);
	mynode.style=style;
	if (hl.children[string_index])
			hl.children[string_index].style=style;
	else
		hl.appendChild(mynode);
}