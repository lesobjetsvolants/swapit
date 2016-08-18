<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
</head>
<body style="margin:50px">
converting...
<table>
<tr>
<?php
$text=file('3 balles sync p16.txt');
echo '<td>';
foreach($text as &$t)
{
  echo '<div>'.$t.'</div>';
  
}
echo '</td>';
echo '<td>';
foreach($text as &$t)
{
  $t=str_replace('[222]','[111]x',$t);
  $t=str_replace('[2x2x]','[11]',$t);
  $t=str_replace('[22]','[11]x',$t);
  $t=str_replace('2x','1',$t);
  $t=str_replace('2','1x',$t);
  $t=str_replace('[4x4x4x]','[222]x',$t);
  $t=str_replace('[4x4x]','[22]x',$t);
  $t=str_replace('4x','2x',$t);
  $t=str_replace('4','2',$t);
  $t=str_replace('[66]','[33]x',$t);
  $t=str_replace('6x','3',$t);
  $t=str_replace('6','3x',$t);
  $t=str_replace('[8x8x]','[44]x',$t);
  $t=str_replace('8x','4x',$t);
  $t=str_replace('8','4',$t);
  //$t=str_replace(['2','4'],['1','2'],$t);
  echo '<div>'.$t.'</div>';
}
echo '</td>';
?>
</tr></table>
</body>
</html>
