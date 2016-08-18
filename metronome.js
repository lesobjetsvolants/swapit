"use strict";

function metronome_blink()
{
	document.getElementById('metronome_box')
					 .style.backgroundColor=metronome.bgcolor;
	if (score.total_beat_count>0)
		document.getElementById('beat_count')
					 .innerHTML=metronome.count%score.total_beat_count+1;
	if (metronome.bgcolor==metronome.color_on)
		metronome.bgcolor=metronome.color_off;
	else
		metronome.bgcolor=metronome.color_on;
	var delta=new Date().getTime()
						-metronome.start_time
						-metronome.count*metronome.delay;
	metronome.timer_id=setTimeout(metronome_blink,
																	metronome.delay-delta);
	metronome.count++;
	// console.log('count=',metronome.count,'delta=',delta);
}

var metronome={
	start_time:0,
	count:0,
	delay:500,
	run:false,
	color_on:'red',
	color_off:'#333333',
	bgcolor:this.color_off,
	timer_id:null,
	tempo:function(t)
	{
		this.delay=Math.round(60000/t);
		this.start_time=new Date().getTime();
		this.count=0;
		document.getElementById('tempo').value=t;
	},
	start:function()
	{
		this.run=!this.run;
		if (this.run)
		{
			this.start_time=new Date().getTime();
			this.count=0;
			this.bgcolor=this.color_on;
			metronome_blink();
			// document.getElementById('mp3player').play();
		}
		else
		{
			window.clearTimeout(this.timer_id);
			this.run=false;
			this.old_time=0;
			this.bgcolor=this.color_off;
			document.getElementById('metronome_box')
					 .style.backgroundColor=this.bgcolor;
		}
	}
};
