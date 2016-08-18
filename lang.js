
var localtext={
	lang:'fr',

	change_lang:function(l)
	{
		if (l)
		{
			this.lang=l;
			parse();
		}
	},
	
	error:{
		comments:{
			eng:'comments need two /',
			fr:'les commentaires nécessitent deux /',
		},
		dwell:{
			misplaced:{
				eng:'dwell hold misplaced',
				fr:'dwell hold mal placé',
			},
			outside_sync:{
				eng:'dwell hold outside sync',
				fr:'dwell hold en dehors d\'un sync',
			},
			two_inarow:{
				eng:'two dwell holds in a row',
				fr:'deux dwell holds à la suite',
			},			
		},
		error:{
			eng:'Syntax error : ',
			fr:'Erreur de syntaxe : ',
		},
		extension:{
			t:{
				eng:'extension t only valid for 2',
				fr:'extension t valide seulement pour 2',
			},
		},
		loop:{
			number_following:{
				eng:'number or % expected after loop close',
				fr:'nombre ou % attendu après une boucle',
			},
			too_many_ends:{
				eng:'too many loop ends',
				fr:'trop de fins de boucles',
			},
			missing_ends:{
				eng:'missing loop ends',
				fr:'fin de boucles manquantes',
			},
			inside_multiplex:{
				eng:'loop forbidden inside multiplex',
				fr:'boucle interdite dans un multiplex',
			},
			inside_sync:{
				eng:'loop forbidden inside sync',
				fr:'boucle interdite dans un sync',
			},
		},
		multiplex:{
			already_open:{
				eng:'multiplex already open',
				fr:'multiplex déjà ouvert',
			},
			misplaced:{
				eng:'multiplex misplaced',
				fr:'multiplex mal placé',
			},
			not_closed:{
				eng:'multiplex is not closed',
				fr:'multiplex non fermé',
			},
			not_open:{
				eng:'multiplex is not open',
				fr:'multiplex non ouvert',
			},
			out_of_phrase:{
				eng:'multiplex out of phrase',
				fr:'multiplex en dehors d\'une phrase',
			},
		},
		phrase:{
			not_open:{
				eng:'no phrase open',
				fr:'pas de phrase ouverte',
			},
			already_open:{
				eng:'phrase already open',
				fr:'phrase déjà ouverte',
			},
			solo_already_started:{
				eng:'solo phrase already started',
				fr:'phrase solo déjà ouverte',
			},
			last_not_closed:{
				eng:'last phrase not closed',
				fr:'dernière phrase non fermée',
			},
			open_inside_sync:{
				eng:'open phrarse inside sync',
				fr:'phrase ouverte à l\'intérieur d\'un sync',
			},
			open_inside_multiplex:{
				eng:'open phrase inside multiplex',
				fr:'phrase ouverte dans un multiplex',
			},
			separator_misplaced:{
				eng:'Separator out of group phrase',
				fr:'Séparateur en dehors d\'une phrase de groupe',
			},
			throw_outside:{
				eng:'throw outside phrase',
				fr:'lancer en dehors d\'une phrase',
			},
		},
		sync:{
			already_open:{
				eng:'sync already open',
				fr:'sync déjà ouvert',
			},
			not_open:{
				eng:'sync not open',
				fr:'sync non ouvert',
			},
			close_sth_missing:{
				eng:'something missing before sync close',
				fr:'quelque chose manque avant fermeture de sync',
			},
			closed_in_bad_place:{
				eng:'sync closed in bad place',
				fr:'sync fermé au mauvais endroit',
			},
			comma:{
				missing:{
					eng:'comma missing',
					fr:'virgule manquante',
				},
				already_passed:{
					eng:'comma already passed',
					fr:'virgule déjà passée',
				},
				inside_multiplex:{
					eng:'comma inside multiplex',
					fr:'virgule à l\'intérieur d\'un multiplex',
				},
				sth_missing:{
					eng:'something missing before comma',
					fr:'quelque chose manque avant la virgule',
				},
			},
			not_closed:{
				eng:'sync not closed',
				fr:'sync non fermé',
			},
		},
		unexpected_character:{
			eng:'unexpected character',
			fr:'caractère inattendu',
		},
		x_already_there:{
			eng:'there is already an x',
			fr:'il y a déjà un x',
		},
		pass_already_there:{
			eng:'there is already a pass',
			fr:'il y a déjà une passe',
		},
		percent_misplaced:{
			eng:'% must be after sync or loop',
			fr:'% doit suivre un lancer sync ou une boucle',
		},
	},
	average:{
		eng:'Average',
		fr:'Moyenne',
	},
	add:{
		eng:'add ',
		fr:'ajoutez ',
	},
	beat:{
		eng:'beat',
		fr:'temps',
	},
	in_phrase:{
		eng:' in phrase ',
		fr:' dans la phrase ',
	},
	for_juggler:{
		eng:' for juggler ',
		fr:' pour le jongleur ',
	},
	juggler:{
		eng:' juggler',
		fr:' jongleur',
	},
	you_miss:{
		eng:'You miss ',
		fr:'Il manque ',
	},
	left:{
		eng:'left',
		fr:'gauche',
	},
	right:{
		eng:'right',
		fr:'droite',
	},
	beat:{
		eng:'beat',
		fr:'temps',
	},
	hand:{
		left:{
			eng:'in right hand',
			fr:'dans la main droite',
		},
		right:{
			eng:'in left hand',
			fr:'dans la main gauche',
		},
	},
	mode_complex:{
		eng:'Complex mode',
		fr:'Mode complexe',
	},
	mode_alternate:{
		eng:'Pure alternate mode',
		fr:'Mode alterné pur',
	},
	number_of_jugglers:{
		eng:'Number of jugglers : ',
		fr:'Nombre de jongleurs : ',
	},
	number_of_phrases:{
		eng:'Number of phrases : ',
		fr:'Nombre de phrases : ',
	},
	objects_string:{
		eng:'objects',
		fr:'objets',
	},
	pattern:{
		oriented:{
			eng:'oriented pattern',
			fr:'figure orientée',
		},
		symmetric:{
			eng:'symmetric pattern',
			fr:'figure symétrique',
		},
	},
	period:{
		eng:'Period ',
		fr:'Période ',
	},
	remove:{
		eng:' or remove ',
		fr:' ou enlevez ',
	},
	sequence:{
		valid:{
			eng:'Valid Sequence',
			fr:'Séquence valide',
		},
		invalid:{
			eng:'Invalid Sequence',
			fr:'Séquence invalide',
		},
	},
	throws_:{
		eng:' throws',
		fr:' lancers',
	},
	too_many:{
		eng:' too many',
		fr:' en trop',
	},
	state_diagrams:{
		eng:'State Diagrams',
		fr:'Diagrammes d\'état',
	},
	max_height:{
		eng:'maximum height',
		fr:'hauteur maximum',
	},
};
