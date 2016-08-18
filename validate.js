
"use strict";

function check_orbits()
{
	
};

function validate()
{
  var somme=0;
  var beat_count=score.jugglers[1].current_beat;
  var moyenne=0;
	
  //------------------------------------ affichage statistiques ------
  debug_output(score.current_juggler,localtext.juggler,'<br>',
							 score.current_phrase,' phrases<br>'
							 );

	//------------------------------- average and landings ---------
  for (var j=1;j<=score.jugglers_count;j++) //  jugglers
    for (var bc=1;bc<=beat_count;bc++)       // beats
      for (var hand=0;hand<2;hand++)         // hands
      {
        var b=score.jugglers[j].beats[bc];
        if (b&&b[hands[hand]])
        {
          var th=b[hands[hand]].thro;
          for (var thi in th)                  // throws
					{
						var hi=parseInt(th[thi].height);
						if (!isNaN(hi)&&(hi!=0))
						{
							somme+=hi; // ----------somme
							
							//----------------hauteur maximum
							score.max_height=Math.max(score.max_height,hi);
							
							 // choix main de destination
							var hand2=hand;
							if ((hi%2)!=0)  // lancer impair
								hand2=1-hand2;
							if (th[thi].crossingness)  // x 
								hand2=1-hand2;
							if (score.pure_alternate)
								hand2=1;

							 // p : changer de jongleur
							var j2=j;
							if (th[thi].pass)
							{
								if (th[thi].pass=='p')
								{
									j2=j+1;
									if (j2>score.jugglers_count)
										j2=1;
								}
								else if (th[thi].pass=='q')
								{
									j2=j-1;
									if (j2<1)
										j2=score.jugglers_count;
								}
							}

							var b2=(bc+hi-1)%score.total_beat_count+1;

							// console.log('validate_landings','dest juggler=',j2,
													 // 'origin beat=',bc,
													 // 'height=',hi,
													 // 'dest beat=',b2,
													 // 'dest hand=',hands[hand2],
													 // 'extension=',th[thi].extension
													 // );
													 
							score.new_landing(j2,hands[hand2],b2);
							
							//------------------------ contruction of state diagrams
							var delta=0;
							for (var i=hi;i>0;i--)
							{
								score.new_state(j2,hands[hand2],
																(bc+delta-1)%score.total_beat_count+1,
																hi-delta);
								delta++;
							}														
							
							// --------------------- orbit calculation
							var temp_index=null;
							var next=false;
							var i=1;
							// in case of multiplex
							//while (score.jugglers[j2]
							//						.beats[b2][hands[hand2]].thro[i]) 
							//	i++;
								
						//	temp_index=score.jugglers[j2]
						//									.beats[b2][hands[hand2]].thro[1]
						//									.orbit_index;

						//	console.log('temp_index=',temp_index);

						//	if (temp_index==null)
						//	{
						//		score.current_orbit_index++;
						//		temp_index=score.current_orbit_index;
						//		score.set_orbit_index(j2,
						//													b2,
						//													hands[hand2],
						//													temp_index
						//													);
						//	}
						//	score.set_orbit_index(j,
						//													bc,
						//													hands[hand],
						//													temp_index
						//													);
						}
					}
        }
      }
			

  moyenne=somme/beat_count;
	
  debug_output(localtext.period,beat_count+'<br>');
	
	if (score.pure_alternate)
	{
		debug_output(localtext.mode_alternate,' / ');
		if (beat_count%2==0)
			debug_output(localtext.pattern.oriented);
		else
			debug_output(localtext.pattern.symmetric);
	}
	else
		debug_output(localtext.mode_complex);
	debug_output('<br>');
	var moyenne_entiere=(Math.floor(moyenne)==moyenne);
  if (moyenne_entiere)
	{
		score.object_count=moyenne;
		debug_output(moyenne+' ',localtext.objects_string);
	}
	else
		debug_output(localtext.average,
								' : '+Math.round(moyenne*100)/100
							+' (',
							localtext.add,
							+(Math.floor(moyenne+1)*beat_count-somme),
							localtext.remove,
							(somme-Math.floor(moyenne)*beat_count)
							+')');
  debug_output('<br>');

	//----------------------------- validation -----------
  for (var j=1;j<=score.jugglers_count;j++) // jugglers
    for (var bc=1;bc<=score.total_beat_count;bc++)  //      beats
      for (var hand=0;hand<2;hand++)            //  hands
      {
        var b=score.jugglers[j].beats[bc];
        if (b)
        {
					var throws_number=0;
          var onehand=b[hands[hand]];
					if (onehand)
					{
						for (var thi in onehand.thro) //-----------     throw
							if (!isNaN(thi))  //    counting the throws
							{
								if ((onehand.thro[thi])
									&&(onehand.thro[thi].height!=0)
									&&(onehand.thro[thi].height!='-'))
									throws_number++;
							}
							if (onehand.landings)			// is there a landing
							{
								if (throws_number!=onehand.landings)
								{
									score.valid=false;
									debug_output(localtext.juggler,
															'&nbsp;'+j+',&nbsp;',localtext.beat,' '+bc+' : ');
									if (throws_number>onehand.landings) 
										// not enough landings
									{
										// console.log('manque',onehand[thi].original_string_position,onehand[thi].height);
										colorize(onehand.thro[1].original_string_position,style.NOTENOUGHLANDINGS);
										debug_output(' il manque '
													+(throws_number-onehand.landings)
													+' arrivées (pour '
													+throws_number,
													localtext.throws_,
													') ');
										if (!score.pure_alternate)
											debug_output(localtext.hand[hands[hand]]);
										debug_output('<br>');
									}
									else  //------------------   too many landings
									{
										if ((throws_number!=0)
											&&(onehand.thro[1].original_string_position))
											colorize(onehand.thro[1].original_string_position,					style.TOOMANYLANDINGS);
										debug_output((onehand.landings-throws_number)
													+' arrivées en trop ');
										if (!score.pure_alternate)
											debug_output(localtext.hand[hands[hand]]);
										debug_output('<br>');
									}
								}
							}
					}
					// --------------- no landing but some throws
					if (onehand&&(onehand.landings==null)&&(throws_number!=0))
					{
						score.valid=false;
						colorize(onehand.thro[thi].original_string_position,style.NOTENOUGHLANDINGS);
						debug_output(localtext.juggler,
									'&nbsp;'+j+',&nbsp;',localtext.beat,' '+bc
									+' : pas d\'arrivée pour '+throws_number
									+' lancers ');
						if (!score.pure_alternate)
							debug_output(localtext.hand[hands[hand]]);
						debug_output('<br>');
					}
				}
			}

	//------------------------display max height
	debug_output(localtext.max_height,' ',score.max_height);

	//-------------------------- résultat validité
	debug_output('<br><br>');
	if (score.valid)
		debug_output(localtext.sequence.valid);
	else
		debug_output(localtext.sequence.invalid);
	debug_output('<br>');

	// ----------------------build states
	debug_output('<br>',score.build_state_diagrams(),'<br>');


	//------------- check if some states are the same
	var state_list=[];
	for (var b=1;b<=score.total_beat_count;b++)
	for (var j=1;j<=score.jugglers_count;j++)
	{
		var full_state='';
		for (var h=0;h<2;h++)
		{
			if (score.jugglers[j].beats[b][hands[h]])
			full_state+=score.jugglers[j].beats[b][hands[h]].state_string+' )  ';
		}

		if (state_list[full_state])
			state_list[full_state]++
		else
			state_list[full_state]=1;
	}
	
	debug_output('<br>State list : <br>',dump(state_list),'<br>');
	
	//--------------- check about hurrys
	if (!score.pure_alternate)
  for (var j=1;j<=score.jugglers_count;j++) // jugglers
    for (var b=1;b<=score.total_beat_count;b++)  //      beats
      for (var h=0;h<2;h++)            //  hands
			{
				var hd=score.jugglers[j].beats[b][hands[h]];
				if (hd)
				{
					var t=hd.thro;
					if (t)
					{
						var ti=1;
						while (t[ti])
						{
							if ((t[ti].height==1)&&(t[ti].crossingness=='x'))
							{}	// rien à péter
							else if ((t[ti].height==0)||(t[i].height=='-'))
							{}	// que dalle
							else
							{
								// debug_output(b+' : on va checker le dwell y a un ',t[ti].height,'<br>');
								if (hd.state[1])
									debug_output('beat '+b+' : ah y a une balle qui arrive trop vite au temps d\'après<br>');
							}	
							ti++;
						}
					}
				}
			}
	debug_output('<br>');
			
	//---------------------------------------
	debug_output('<br>');
	debug_output('query string :',QueryString());
};
