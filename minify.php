<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
</head>
<body style="margin:50px">
Minifying...
<table>
<?php
//variable name replacements
$searchvariables=['debug_output','score','localtext','colorize','convert_to_html','error_output','current_','temp_highlight','error_','original_string_position','dontcloseityet','jugglers','loop_just_closed','loop_level','beats','hands','user_input','phrase_open','number_following','inputsiteswap','onehand','multiplex_open','is_multiplex','new_',
'check_phrase_length'
];
$replacevariables=[];

foreach ($searchvariables as $key=>$value)
  $replacevariables[]='r'.$key;


$css=file('style.css');
foreach($css as &$c)
{
  $c=trim($c);
  if ($c=='')
    $c=null;
}
$css=implode('',$css);
$css=str_replace(';}','}',$css);


$html=file('index.html');
                  
foreach ($html as &$h)
{
  if (trim($h)=='')
    $h=null;
  $t=strpos($h,'<script');
  if ($t!==false)
  {
    $filename=explode('"',substr(trim($h),13));
    echo '<tr><td>'.$filename[0].'</td></tr>';
    $js=file($filename[0]);
    foreach($js as &$j)
    {
      //strip comments
      $temp=explode('//',$j);
      $j=$temp[0];
      //strip empty lines
      $j=trim($j);
      if ($j=='')
        $j=null;
      $j=str_replace('"use strict";','',$j);
      $j=str_replace('debug=true','debug=false',$j);
      //$j=str_replace($search,$replace,$j);
      // concat lines that can
      if (!in_array(substr($j,-1),[';',',','{',':','=',')'])
         &&($j!=null))
        $j.="\n";
      //echo '<tr><td>'.$j.'</td></tr>';
    }
    $js=implode('',$js);
    
    // replace some variables long names
//    if ($filename[0]!='three.min.js')
//      $js=str_replace($searchvariables,$replacevariables,$js);
    
    $js=str_replace(';}','}',$js);

    $h='<script>'.$js.'</script>';
  }  
}

echo '</table><br><br>';

$html=preg_replace('/\h+/',' ',$html);

$html=implode('',$html);
$html=str_replace('<link rel="stylesheet" type="text/css" href="style.css">',
                  '<style>'.$css.'</style>',$html);

$html=str_replace('</script><script>','',$html);
file_put_contents('minified/swapit.html',$html);

//-------------- text statistics for further replacement
$stats=[];
preg_match_all('/[a-zA-Z_]+/',$html,$result);
//print_r($result);
foreach ($result[0] as $key=>$value)
  if (array_key_exists($value,$stats))
    $stats[$value]++;
  else 
    $stats[$value]=1;
  
ksort($stats);
foreach ($stats as $key=>$value)
  if ((strlen($key)>10)&&($value>10))
    echo $key.'=>'.$value.'<br>';
?>
</body>
</html>
