// state diagrams

score.build_state_diagrams=function()
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
		
		this.ground_state_temperature=this.object_count*(this.object_count+1)/2;
		this.average_temperature=Math.floor(this.total_excitation/this.total_beat_count*100)/100;
		this.temperature_ratio=Math.floor(this.total_excitation/this.ground_state_temperature/this.total_beat_count*100)/100;
		
		if (this.temperature_ratio==1)
			this.temperature_character='liquid';
		else if (this.temperature_ratio>1)
			this.temperature_character='hot';
		else if (this.average_temperature==this.object_count)
			this.temperature_character='frozen (or "solid")';
		else if (this.temperature_ratio<1)
			this.temperature_character='cold';
		
		
		s+='average temperature for this pattern = '+this.average_temperature+'<br>';

		s+='ground state temperature for '+this.object_count+' balls = '+this.ground_state_temperature+'<br>';
		
		s+='temperature ratio compared to ground state = '+this.temperature_ratio+'<br>';
		
		s+=this.temperature_character+'<br>';
		
		return '<br>'+s;
	};
