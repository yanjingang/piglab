<?php
/*
https:80请求透传python api
Cmd:
	https://www.yanjingang.com/piglab/api/request.php?session_id=1548849426270&req_type=gomoku&location=3,4
	https://www.yanjingang.com/piglab/api/request.php?session_id=1548849426270&req_type=chess&move=d7d5
*/
session_start();
$session_id = $_REQUEST['session_id'];
$req_type = $_REQUEST['req_type'];
//unset($_REQUEST['req_type']);
$params = http_build_query($_REQUEST); //参数透传

$result = array('code'=>-1,'msg'=>'req_type not exists!','data'=>array());
$url = '';
switch($req_type){
    case 'gomoku':
		$url = "http://www.yanjingang.com:8023/piglab/game/gomoku?".$params;
		break;
    case 'chess':
		$url = "http://www.yanjingang.com:8024/piggy-chess/move?".$params;
		break;
	case 'chess-list':
		$url = "http://www.yanjingang.com:8024/piggy-chess/list?".$params;
		break;
    case 'face_register':
		$url = "http://www.yanjingang.com:8025/piglab/face?".$params;
		break;
}
#exit($url);

if($url!=''){
	$res = file_get_contents($url);
	$result = json_decode($res,true);
}

header("Content-type: application/json");
echo json_encode($result);
