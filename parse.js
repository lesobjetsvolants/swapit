
"use strict";

function check_directive()
{
		if (user_input.substr(n,5)=='tempo')
		{
			for (var i=0;i<5;i++)
				colorize(n++,style.OK);
			while (user_input[n]&&(user_input[n]==' ')) //---- blank spaces 
				colorize(n++,style.OK);

			var number_string='';
			while (user_input[n]&&user_input[n].match(/[0-9]/g))
			{
				number_string+=user_input[n];
				colorize(n++,style.OK);
			}
			
			var number=parseInt(number_string);
			if (!isNaN(number))
			{
				score.tempo=number;
				metronome.tempo(score.tempo);
				n--;
			}
			else
				error_output('tempo value not ok<br>');
			
		}
		else if (user_input.substr(n,9)=='startleft')
		{
			console.log('found:startleft');
			
		}
		else
		{
			error_output('problème directive');
			colorize(n,style.ERROR);
		}
}

function check_phrase_length()
{
  	if (score.phrase_current_beat>score.phrase_beat_count)
		{
			error_output((score.phrase_current_beat-score.phrase_beat_count),
										localtext.throws_,
										localtext.too_many,
										localtext.for_juggler,
										score.current_juggler,
										localtext.in_phrase,
										score.current_phrase+'<br>');
			return false;
		}
		else if (score.phrase_current_beat<score.phrase_beat_count)
		{
			error_output(localtext.you_miss,
										(score.phrase_beat_count-score.phrase_current_beat)
										+' lancers ',localtext.for_juggler,
										score.current_juggler,
										localtext.in_phrase,
										score.current_phrase+'<br>');
			return false;
		}
		else
			return true;
}

function pre_parse(ev)
{
	var keycodes=[16,17,18,33,34,35,36,37,38,39,40,18];
	var span=document.getElementById('highlight');
	var former_caret_pos=caret.pos;
	// console.log('keycode=',ev.keyCode,' former pos=',former_caret_pos,' caret.pos=',caret.pos);
	// ----position du curseur
	caret.pos=document.getElementById('inputsiteswap').selectionEnd;
	if (ev
		&&(keycodes.indexOf(ev.keyCode)>=0)
		&&(former_caret_pos!=caret.pos)
		&&(span.children[former_caret_pos]))
	{
		span.children[former_caret_pos]
				.style.backgroundColor='inherit';
		span.children[former_caret_pos]
				.id='';
	}
	else
		parse();
	caret.set();
}

function parse(ev)
{
	var carriage_return=String.fromCharCode(10);
	document.getElementById('debug').innerHTML='';
	document.getElementById('highlight').innerHTML='';
	score.init();

	user_input=document.getElementById('inputsiteswap').value+' ';
	
  var phrase_de_liste=false;
  var phrase_open=false;
  var multiplex_open=false;
  var multiplex_just_closed=false;
  var directive_expected=false;
  var sync_open=false;
  var sync_just_open=false;
  var sync_just_closed=false;
  var comma_passed=false;
  var dwell_hold=false;
	var youcancloseit=true;
	var repeat_open=false;
	var number_of_repetitions_found=true;
	var juggler_id_expected=false;
	var loop_just_closed=false;
	
	//------------- check x and ( to set pure_alternate
	if ((user_input.indexOf('x')>=0)||(user_input.indexOf('(')>=0))
		score.pure_alternate=false;

  var tl=user_input.length;
	
	for (n=0;n<tl;n++) //------------ début de l'analyse ----------
  {
			var c=user_input[n]; // ----caractère en cours
			
      if (score.error_detected)
        colorize(n,style.ERROR,'error');
      else if (c.match(/[0-9A-Z]/g)) // ------ chiffre ------
      {
				sync_just_open=false;
				sync_just_closed=false;
				multiplex_just_closed=false;

				var number=-1;
				if (c.match(/[A-Z]/g))
						number=c.charCodeAt(0)-55;
				else 
						number=parseInt(c);
				
        if (!phrase_de_liste)
        {
          phrase_open=true;
          score.current_phrase=1;
        }

        if (!phrase_open) //---------------------------------
          error_output(localtext.error.phrase.throw_outside);
        else if (sync_open) //--------- new sync throw -------
        {
          if (!comma_passed)
						score.new_throw(number,'left');
          else
						score.new_throw(number,'right');
					colorize(n,style.OK);
        }
        else if (multiplex_open)  //-----------------------
        {
					if (c=='0')
						error_output('please don\'t put zeros inside multiplexes');
					else
					{
						score.new_throw(number);
						colorize(n,style.OK);
					}
        }
        else if (loop_just_closed) // number of loop repetition
				{
					loop_just_closed=false;

					if (c=='0')
					{
						error_output('number of reps must be >0');
						colorize(n,style.ERROR);
					}
					else if (score.loops[score.loop_level+1])
					{
						colorize(n,style.TAG);
						number_of_repetitions_found=true;

						if (!score.loops[score.loop_level+1].number)
							score.loops[score.loop_level+1].number=
								score.loops[score.loop_level+1].number_left=number;

						score.loops[score.loop_level+1].number_left--;

						if (score.loops[score.loop_level+1].number_left>0)
							n=score.loops[score.loop_level+1].beginning-1;
					}
				}
				else if (juggler_id_expected) //--numéro de jongleur pour passe
				{
					if (c=='0')
					{
						error_output('juggler id must be >0');
						colorize(n,style.ERROR);
					}
					else
					{
						juggler_id_expected=false;
						colorize(n,style.TAG);
					}
				}
				else //------------------- new unilateral throw
        {
          if (score.current_juggler==0)
            score.new_juggler();
          score.new_beat();
          score.next_hand();
          score.new_throw(number);
          colorize(n,style.OK,'throw height');
        }
      }
      else if (c.match(/[a-z]/g)) // ------ lettre ------
      {
				if (directive_expected)
				{
					var dir='';
					
					for (var k=0;k<dir.length;k++)
						colorize(n++,style.EXTENSION);
					n--;
				}
				else if (!phrase_open)
					error_output('extension misplaced');
				else
				{
					// console.log('extension found');
					var ext='';
					var extensions=['t','x','b','c','f','r','h','p','q','i','o','bol','ac','al','opac','opal'];
					extensions.forEach(function(el,index,array){
						if (user_input.substr(n,el.length)==el)
							ext=el;
					});
					if (ext!='')
					{
						var hand=null;
						if (sync_open)
						{
							if (comma_passed)
								hand='right';
							else
								hand='left';
						}
						score.new_extension(ext,hand,multiplex_just_closed);
					}
					else
						error_output('unknown extension');

					for (var k=0;k<ext.length;k++)
						colorize(n++,style.EXTENSION);
					n--;
				}
			}
      else switch (c)
			{
				case '<': //------------------<    -------------------
					if (sync_open)
						error_output(localtext.error.phrase.open_inside_sync);
					else if (multiplex_open)
						error_output(localtext.error.phrase.open_inside_multiplex);
					else if (loop_just_closed)
						error_output(localtext.error.loop.number_following);
					else
						loop_just_closed=false;

					if (!phrase_de_liste&&phrase_open)
						error_output(localtext.error.phrase.solo_already_started);
					else
					{
						phrase_de_liste=true;
						if (phrase_open)
							error_output(localtext.error.phrase.already_open);
						else
						{
							phrase_open=true;
							score.new_phrase();
							if (score.current_phrase==1)
								score.new_juggler();
							else 
								score.current_juggler=1;
							colorize(n,style.TAG);
						}
					}
				break;
      case '|':  //----------------|   -------------------
				if (loop_just_closed)
					error_output('number expected after loop close');
				else if (sync_open)
					error_output(localtext.error.sync.not_closed);
				else if (multiplex_open)
					error_output(localtext.error.multiplex.not_closed);
				else if (!phrase_open)
					error_output(localtext.error.phrase.separator_misplaced);
				else //------------------------- séparateur légitime----
				{
					loop_just_closed=false;
					if (score.current_juggler==1) // determine phrase period---
					{
						score.phrase_beat_count=score.phrase_current_beat;
						score.phrase_current_beat=0;
					}
					else
						youcancloseit=check_phrase_length();
					
					if (score.current_phrase==1) // if first phrase : new juggler
						score.new_juggler();
					else
					{
						score.current_juggler++;
						if (score.current_juggler>score.jugglers_count)
						{
							debug_output('il y a '
							+(score.current_juggler-score.jugglers_count)
							+' jongleur(s) en trop dans la phrase n°'
							+score.current_phrase);
							youcancloseit=false;
						}
					}

					score.phrase_current_beat=0;
				
					if (youcancloseit)
						colorize(n,style.TAG);
					else
						colorize(n,style.ERROR);
				}
				break;
      case '>': // ---------->     ----------------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (multiplex_open)
          error_output(localtext.error.multiplex.not_closed);
        else if (sync_open)
          error_output(localtext.error.sync.not_closed);
        else if (!phrase_de_liste)
          error_output(localtext.error.phrase.solo_already_started);
        else if (!phrase_open)
          error_output(localtext.error.phrase.not_open);
        else // ------------------- fermeture légitime ------------------
        {
					loop_just_closed=false;

          if (score.current_phrase>1)
          {
            if (score.current_juggler<score.jugglers_count)
            {
              debug_output('il manque '
                            +(score.jugglers_count-score.current_juggler)
                            +' jongleur(s) dans la phrase n°'
                            +score.current_phrase+'<br>');
              youcancloseit=false;
            }
          }

          if (score.current_juggler>1)
						youcancloseit=check_phrase_length();
				
          if (youcancloseit)
            colorize(n,style.TAG);
          else
            colorize(n,style.ERROR);
          phrase_open=false;
				}
        break;
      case '(': //--------------(     ------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (phrase_de_liste&&!phrase_open)
          error_output('sync open outside of phrase');
        else if (multiplex_open)
          error_output('sync open inside multiplex');
        else if (sync_open)
          error_output(localtext.error.sync.already_open);
        else
        {
					loop_just_closed=false;
          sync_just_open=true;
          sync_open=true;
					if ((!phrase_de_liste)&&(score.phrase_current_beat==0))
						score.new_juggler();
          colorize(n,style.TAG);
          score.new_beat();
        }
				break;
      case ',': //---------------------,  ------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (comma_passed)
          error_output(localtext.error.sync.comma.already_passed);
        else if (multiplex_open)
          error_output(localtext.error.sync.comma.inside_multiplex);
        else if (!sync_open)
          error_output(localtext.error.sync.not_open);
        else if (sync_just_open)
          error_output(localtext.error.sync.comma.sth_missing);
        else
        {
					loop_just_closed=false;
          comma_passed=true;
          dwell_hold=false;
          sync_just_open=true;
          colorize(n,style.TAG);
        }
				break;
      case ')': //-------------- ) ---------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (multiplex_open)
          error_output(localtext.error.sync.closed_in_bad_place);
        else if (!sync_open)
          error_output(localtext.error.sync.not_closed);
        else if (!comma_passed)
          error_output(localtext.error.sync.comma.missing);
        else if (sync_just_open)
          error_output(localtext.error.sync.close_sth_missing);
        else
        {
					dwell_hold=false;
					loop_just_closed=false;
          sync_open=false;
          sync_just_closed=true;
          comma_passed=false;
          colorize(n,style.TAG);
        }
				break;
			case '[': //--------------[     ---------------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (dwell_hold)
          error_output(localtext.error.multiplex.misplaced);
        else if (phrase_de_liste&&!phrase_open)
          error_output(localtext.error.multiplex.out_of_phrase);
        else if (multiplex_open)
          error_output(localtext.error.multiplex.already_open);
        else
        {
					sync_just_open=false;
					sync_just_closed=false;
          multiplex_open=true;
					if (!phrase_de_liste
							&&!phrase_open
							&&score.phrase_current_beat==0)
						score.new_juggler();
          if (!sync_open)
            score.new_beat();
					score.next_hand();
          colorize(n,style.TAG);
        }
				break;
      case ']': //--------------]     ---------------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (!multiplex_open)
          error_output(localtext.error.multiplex.not_open);
        else
        {
          multiplex_open=false;
          multiplex_just_closed=true;
          colorize(n,style.TAG);
        }
				break;
			case '-': //------------------- dwell hold ---------------
				if (loop_just_closed)
					error_output(localtext.error.loop.number_following);
				else if (!sync_open)
          error_output(localtext.error.dwell.outside_sync);
        else if (!sync_just_open)
          error_output(localtext.error.dwell.misplaced);
        else if (dwell_hold)
          error_output(localtext.error.dwell.two_inarow);
        else //---------------- dwell hold légitime ---------------
        {
          dwell_hold=true;
          sync_just_open=false;

          if (score.current_juggler==0)
            score.new_juggler();
					if (!comma_passed)
						score.new_throw(c,'left');
					else
						score.new_throw(c,'right');

          colorize(n,style.OK);
        }
				break;
		case '/':  //-----------------/ comment
			if (user_input[n+1]=='/')  // ------- correct comment line
			{
				while (user_input[n]&&(user_input[n]!=carriage_return))
					colorize(n++,style.COMMENT);
				if (user_input[n])
					colorize(n,style.COMMENT);
			}
			else
				error_output(localtext.error.comments);
			break;
		case '{': //-----------------------{ ---------
				if (sync_open)
					error_output(localtext.error.loop.inside_sync);
				else if (multiplex_open)
					error_output(localtext.error.loop.inside_multiplex);
				else if (loop_just_closed)
					error_output(localtext.error.loop.percent_misplaced);
				else
				{
					colorize(n,style.TAG);
					score.loop_level++;
					if ((!score.loops[score.loop_level])
							||(score.loops[score.loop_level].number_left==0))
						score.loops[score.loop_level]={beginning:n,end:-1};
					// si la boucle existe déjà et number_left>0 
					// c'est qu'on en est déjà à la deuxième répétition
					// sinon on initialise la nouvelle boucle
				}
			break;
		case '}': //------------------------} -------
			number_of_repetitions_found=false;
			if (sync_open)
				error_output(localtext.error.sync.not_closed);
			else if (multiplex_open)
				error_output(localtext.error.multiplex.not_closed);
			else if (loop_just_closed)
				error_output(localtext.error.loop.number_following);
			else
			{
				colorize(n,style.TAG);
				if (score.loops[score.loop_level])
					score.loops[score.loop_level].end=n;
				score.loop_level--;
				loop_just_closed=true;
			}
			break;
		case ':': //-------------------- passe vers un jongleur numéroté
			juggler_id_expected=true;
			colorize(n,style.TAG);
			break;
		case '%': //---------------------------% opposition ----
			if (!sync_just_closed&&!loop_just_closed)
				error_output(localtext.error.percent_misplaced);
			else if (loop_just_closed)
				error_output('case not handled yet: complex opposition');
			else
			{
				sync_just_closed=false;
				colorize(n,style.TAG);
				score.new_beat();
				score.jugglers[score.current_juggler]
						 .beats[score.jugglers[score.current_juggler]
												 .current_beat]
						 .left=[];
				score.jugglers[score.current_juggler]
						 .beats[score.jugglers[score.current_juggler]
												 .current_beat]
						 .left.thro= 
					score.jugglers[score.current_juggler]
							.beats[score.jugglers[score.current_juggler]
													.current_beat-1]
							.right.thro;
				score.jugglers[score.current_juggler]
						 .beats[score.jugglers[score.current_juggler]
												 .current_beat]
						 .right=[]; 
				score.jugglers[score.current_juggler]
						 .beats[score.jugglers[score.current_juggler]
												 .current_beat]
						 .right.thro= 
					score.jugglers[score.current_juggler]
							.beats[score.jugglers[score.current_juggler]
												  .current_beat-1]
							.left.thro;
			}
			break;
		case '#': //--------------------------# directive
			// directive_expected=true;
			colorize(n++,style.OK);
			check_directive();
			break;
		case '@': 			//-----nombre de tours pour les massues
			colorize(n,style.OK);
			break;
	  case ' ':
		case carriage_return:
		// case String.fromCharCode(13):
		  colorize(n,style.OK,'space or CR');
			break;
		default: //- --------------------- any other character -----------
			error_output(localtext.error.unexpected_character);
		}
  }

	//------------------------------remaining errors
	if (!score.error_detected)
	{
		if (score.loop_level<0)
			error_output(localtext.error.loop.too_many_ends);
		else if (score.loop_level>0)
			error_output(localtext.error.loop.missing_ends);
		else if (!number_of_repetitions_found)
			error_output(localtext.error.loop.number_following);
		else if (phrase_open&&phrase_de_liste)
      error_output(localtext.error.phrase.last_not_closed);
		else if (multiplex_open)
      error_output(localtext.error.multiplex.not_closed);
		else if (sync_open)
      error_output(localtext.error.sync.not_closed);

		//--------------------phrase de groupe unique,
		// --------------vérification des longueurs de phrases
		if (phrase_open
			&&!phrase_de_liste
			&&(score.current_juggler>1))
				score.error_detected=(score.error_detected||
															!check_phrase_length());

		if (score.error_detected) 			//---   '...'
		{
			var el=document.getElementById('highlight').children[n-1];
			el.innerHTML=String.fromCharCode(8230);
			el.style.color='red';
		}
	}

	if (score.jugglers[1])
		score.total_beat_count=score.jugglers[1].current_beat;
	if (score.current_juggler==1)
		score.phrase_beat_count=score.phrase_current_beat;

	if (!score.error_detected&&(score.jugglers[1]!=null)
					&&(score.jugglers[1].current_beat>0))
		validate();
			
	if (score.valid&&score.debug)
	{
		debug_output('<br><div>'+score.serialize(serialize.NOEXTENSION)+'<br>');
	}

	//-------------------- dump score -------------------------------
	if (score.debug)   debug_output('<br>Score : <br>',dump(score));
}