
"use strict";

var n=0;
var user_input='';
var multiplex_index=0;

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

var hands=['left','right'];

function hand(){
		this.thro=[];
		this.state=[];
		// this.landings=null;
};

function beat(){
	this.serialize=function(mode)
	{
		var s=[];
		s.left='';
		s.right='';
		for (var h in hands)
		{
			if (this[hands[h]])
				for(var i in this[hands[h]].thro)
				{
					s[hands[h]]+=this[hands[h]].thro[i].height;
					if ((mode!=serialize.NOEXTENSION)
						&&(this[hands[h]].thro[i].extension))
						s[hands[h]]+=this[hands[h]].thro[i].extension;
				}
		}
		if (this.left
			&&this.left.thro
			&&(Object.keys(this.left.thro).length>1))
				s.left='['+s.left+']';
		if (this.right
			&&this.right.thro
			&&(Object.keys(this.right.thro).length>1))
				s.right='['+s.right+']';
		if (s.left&&s.right)
			return '('+s.left+','+s.right+') ';
		else if (s.left)
			return s.left+' ';
		else
			return s.right+' ';
	};
  this.new_throw=function(ht,hd)
  {
		if (this[hd]==null)
		{
			this[hd]=new hand();
			multiplex_index=1;
		}
		else
		  multiplex_index++;
	
	if (!this[hd].thro[multiplex_index])
			this[hd].thro[multiplex_index]=[];
		
		this[hd].thro[multiplex_index].height=ht;
		
		// keep original user input position for later coloration
		this[hd].thro[multiplex_index].original_string_position=n;
  };
	this.new_landing=function(hand)
	{ 
		if (!this[hand])
			this[hand]=[];
		if (!this[hand].landings)
			this[hand].landings=0;
		
		this[hand].landings++;
		
		// -------------orbit calculation
		// if (this[hand].orbit_index==null)
			// this[hand].orbit_index=[];
		// if (this[hand].orbit_index[1]==null)
			// this[hand].orbit_index[1]=score.orbit_index;
		// else
			// score.orbit_index++;

		// console.log('landings ',hand,this[hand].landings);
	};
	this.new_state=function(hand,height)
	{
		if (!this[hand])
			this[hand]=[];
		if (!this[hand].state)
			this[hand].state=[];
		if (!this[hand].state[height])
			this[hand].state[height]='';

		this[hand].state[height]+='+';
	};
  this.new_extension=function(e,hand,is_multiplex)
  {
		var i_initial=multiplex_index;
		if (is_multiplex)
			i_initial=1;
		for (var i=i_initial;i<=multiplex_index;i++)
		{
			if (!this[hand])
				this[hand]=[];
			if (!this[hand].thro)
				this[hand].thro=[];
			if (!this[hand].thro[i])
				this[hand].thro[i]=[];
			
			if (e=='x')
			{
				if (this[hand].thro[i].crossingness=='x')
					error_output(localtext.error.x_already_there);
				else
					this[hand].thro[i].crossingness='x';
			}
			else if ((e=='p')||(e=='q'))
			{
				if (this[hand].thro[i].pass)
					error_output(localtext.error.pass_already_there);
				else	
					this[hand].thro[i].pass=e;
			}
			else
			{
				if (!this[hand].thro[i].extension)
					this[hand].thro[i].extension='';
				this[hand].thro[i].extension+=e;
			}
		}
  };
	this.set_orbit_index=function(h,i)
	{
		var j=1;
		while (this[h]
					&&this[h].thro[j]
					&&this[h].thro[j].orbit_index)
					{
						// console.log('hand',h,'throw',j,'objectindex',i);
						j++;
					}	
		if (j>1) j--;
		if (!this[h].thro[j])
			this[h].thro[j]=[];
		this[h].thro[j].orbit_index=i;
	};
};

function juggler(){
  this.beats=[];
  this.current_hand='left';
  this.current_beat=0;
	this.serialize=function(mode)
	{
		var s='';
		for (var b in this.beats)
			s+=this.beats[b].serialize(mode);
		return s;
	};
	this.opposite=function()
	{
		if (this.current_hand=='right')
				this.current_hand='left';
		else if (this.current_hand=='left')
				this.current_hand='right';
	};
  this.new_beat=function()
  {
    this.current_beat++;
		if (!this.beats[this.current_beat])
			this.beats[this.current_beat]=new beat();
  };
  this.new_throw=function(height,hand)
  {
    if (!hand)
      hand=this.current_hand;
    if (!this.beats[this.current_beat])
			this.beats[this.current_beat]=new beat();
		this.beats[this.current_beat]
         .new_throw(height,hand);
  };
  this.new_landing=function(hand,b)
  {
		if (!this.beats[b])
			this.beats[b]=new beat();
		this.beats[b].new_landing(hand);
	};
	this.new_state=function(hand,b,height)
	{
		if (!this.beats[b])
			this.beats[b]=new beat();
		this.beats[b].new_state(hand,height);		
	};
  this.new_extension=function(e,hand,is_multiplex)
  {
		if (!hand)
			hand=this.current_hand;
    this.beats[this.current_beat]
         .new_extension(e,hand,is_multiplex);
  };
  this.next_hand=function()
  {
		// --------------------if pure alternate, do nothing
		//--------------means juggle just like with 1 hand; else
		if (score.pure_alternate)
			this.current_hand='right';
		else
		{
			//----------------- check if there is a 1x
			var onex=false;
			var onex_hand='right';
			// console.log('next_hand in complex mode');
			if (this.beats[this.current_beat-1])
			for (var hand=0;hand<2;hand++)
			if (this.beats[this.current_beat-1][hands[hand]])
			{
				var th=this.beats[this.current_beat-1][hands[hand]]
										.thro;
				if (th)
				for (var thi in th)
				{
					// console.log('next_hand checking',th[thi]);
					if (th[thi]
						&&(parseInt(th[thi].height)==1)
						&&th[thi].crossingness)
					{
						onex=true;
						onex_hand=hands[hand];
				 // console.log('throw=',th[thi].height,
											 // 'onex=',onex,
											 // 'current_hand=',this.current_hand);
					}
				}
			}
			if (!onex)// ----------------- 1x prevents to alternate
				this.opposite();
			else
				this.current_hand=onex_hand;
			 // console.log('onex_hand=',onex_hand,
									 // ' this.current_hand=',this.current_hand,
									 // ' currentbeat=',this.current_beat,
									 // ' thi=',thi
									 // );
		}
  };
	this.set_orbit_index=function(b,h,i)
	{
		if (this.beats[b])
			this.beats[b].set_orbit_index(h,i);
	};
};

var loop={
	beginning:0,
	end:0,
};

var score={
  jugglers:[],
	init:function()
  {
    this.jugglers=[];
    this.current_juggler=0;
    this.jugglers_count=0;
    this.current_phrase=0;
    this.phrase_current_beat=0;
		this.phrase_beat_count=0;
		this.total_beat_count=0;
		this.max_height=0;
		this.pure_alternate=true;
		this.error_detected=false;
		this.current_orbit_index=0;
		this.valid=true;
		this.debug=true;
		this.loop_level=0;
		this.loops=[];
		this.tempo=0;
		this.state_diagram=[];
		this.total_excitation=0;
	},
	
	serialize:function(mode)
	{
		var s='';
		if (this.jugglers_count>1)
		{
			s+='< '+this.jugglers[1].serialize(mode);
			for (var j=2;j<=this.jugglers_count;j++)
				s+='| '+this.jugglers[j].serialize(mode);
			s+=' >';
		}
		else if (this.jugglers[1])
			s=this.jugglers[1].serialize(mode);
		return 'Serialize :<br>'+s;
	},
	build_state_diagrams:function()
	{
		var s='';
		s+=localtext.state_diagrams[localtext.lang];
		s+='<table>';
		s+='<thead>';
		s+='<td style="padding-right:10px">'+localtext.beat[localtext.lang]+'</td>';
		for (var j=1;j<=this.jugglers_count;j++)
			s+='<td colspan="2" style="width:120px">'
				+localtext.juggler[localtext.lang]+' '+j
				+'</td>';
		s+='</thead>';
		s+='<tr><td></td>';
		for (var j=1;j<=this.jugglers_count;j++)
		for (var h=0;h<2;h++)
			s+='<td>'+localtext[hands[h]][localtext.lang]+'</td>';
		s+='</tr>';
		
		for (var b=1;b<=this.total_beat_count;b++)
		{
			s+='<tr><td style="text-align:center">'+b+'</td>';
			for (var j=1;j<=this.jugglers_count;j++)
			{
				var state_number_leftandright=0;
				for (var h=0;h<2;h++)
				{
					s+='<td>';
					var state_string='';
					var state_number=0;
					
					for (var si=this.max_height;si>0;si--)
					{
						if ((this.jugglers[j].beats[b][hands[h]])
								&&(this.jugglers[j].beats[b][hands[h]].state)
								&&(this.jugglers[j].beats[b][hands[h]].state[si]))
						{
							var temp=this.jugglers[j].beats[b][hands[h]].state[si];
							if (temp.length>1)
							{
								state_string+='['+temp+']';
								state_number+=temp.length*si;
							}
							else
							{
								state_string+=temp;
								state_number+=si;
							}
						}
						else
							state_string+='-';
					}	
					
					if (this.jugglers[j].beats[b][hands[h]])
					{						
						this.jugglers[j].beats[b][hands[h]].state_string=state_string;
						this.jugglers[j].beats[b][hands[h]].state_number=state_number;
					}
						
					s+=state_string+' ) '+state_number+' &nbsp;&nbsp;&nbsp;</td>';
					state_number_leftandright+=state_number;
				}
			}
			s+='<td>subtotal='+state_number_leftandright+'</td>';
			this.total_excitation+=state_number_leftandright;
			s+='</tr>';
		}
		s+='</table><br>';
		
		s+='total_excitation='+this.total_excitation+'<br>';
		
		var ground_state_temperature=this.object_count*(this.object_count+1)/2;
		
		s+='average temperature for this pattern = '+Math.floor(this.total_excitation/this.total_beat_count*100)/100+'<br>';

		s+='ground state temperature for '+this.object_count+' balls = '+ground_state_temperature+'<br>';
		
		s+='temperature ratio compared to ground state = '+Math.floor(this.total_excitation/ground_state_temperature/this.total_beat_count*100)/100+'<br>';
		
		return '<br>'+s;
	},
  new_phrase:function()
  {
    this.current_phrase++;
    this.phrase_current_beat=0;
    this.phrase_beat_count=0;
    this.current_juggler=0;
  },
  new_juggler:function()
  {
    this.current_juggler++;
		this.jugglers_count++;
    this.jugglers[this.current_juggler]=new juggler();
		this.phrase_current_beat=0;
	},
  new_beat:function()
  {
    this.jugglers[this.current_juggler].new_beat();
    this.phrase_current_beat++;
  },
  new_throw:function(height,hand)
  {
		if (hand==null)
			hand=this.jugglers[this.current_juggler].current_hand;
    this.jugglers[this.current_juggler].new_throw(height,hand);
  },
  new_landing:function(jug,hand,beat)
  { 
		 // console.log('score.new_landing',
								// 'juggler=',jug,
								// 'hand=',hand,
								// 'beat=',beat,
								// 'height=',h,
								// 'callee=',arguments.callee.caller.name);
		this.jugglers[jug].new_landing(hand,beat);
  },
	new_state(jug,hand,beat,height)
	{
		this.jugglers[jug].new_state(hand,beat,height);
	},
  new_extension:function(e,hand,is_multiplex)
  {
    this.jugglers[this.current_juggler]
				 .new_extension(e,hand,is_multiplex);
  },
  next_hand:function()
  {
    this.jugglers[this.current_juggler].next_hand();
  },
	set_orbit_index:function(j,b,h,i){
		this.jugglers[j].set_orbit_index(b,h,i);
	},
};

