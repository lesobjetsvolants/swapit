// juggler

function juggler()
{
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
