<?php
/*
 * 上传文件并执行后续操作
 *
 */
//echo json_encode($_COOKIE);return;
// https://www.yanjingang.com/piglab/api/upload.php
$PATH = "/home/work/service/odp/webroot/yanjingang/www/piglab/";
$URL = "http://www.yanjingang.com/piglab/";
$SUFFIXS = ['.png', '.jpg', '.jpeg'];

//接收到的文件信息 
//file_put_contents($PATH.'tmp/upload.txt', var_export($_FILES,true));
$uploaded_file = $_FILES['data']['tmp_name'];
$real_name = $_FILES['data']['name'];
$type = $_REQUEST['type'];
$params = http_build_query($_REQUEST); //参数透传

$result = array('status' => 0, 'msg' => 'succ', 'data' => array());
if (!is_uploaded_file($uploaded_file)) {
	$result['status'] = 1;
	$result['msg'] = 'upload fail!';
} else {
	//保存目录
	$save_path = $PATH . 'upload/' . date('ymd') . "/";
	if (!file_exists($save_path)) {
		mkdir($save_path, 0777, true);
	}
	$suffix = substr($real_name, strrpos($real_name, "."));
	if (!in_array($suffix, $SUFFIXS)) {
		$result['status'] = 2;
		$result['msg'] = 'invalid [' . $suffix . '] suffix!';
	} else {
		$save_file = $save_path . time() . rand(1, 1000) . $suffix;
		//file_put_contents($PATH.'upload/save_file.txt', $save_file);
		if (!move_uploaded_file($uploaded_file, iconv("utf-8", "gb2312", $save_file))) {
			$result['status'] = 3;
			$result['msg'] = 'rename fail!';
		}
		#py api_paddle
		$url = '';
		$res_key  = 'res';
		switch ($type) {
			case 'digit':
				$url = "http://www.yanjingang.com:8020/piglab/image/digit?img_file=" . $save_file . "&" . $params;
				break;
			case 'dog_cat':
				$url = "http://www.yanjingang.com:8021/piglab/image/dog_cat?img_file=" . $save_file . "&" . $params;
				break;
			case 'classification':
				$url = "http://www.yanjingang.com:8022/piglab/image/classification?img_file=" . $save_file . "&" . $params;
				break;
			case 'face':
				$url = "http://www.yanjingang.com:8025/piglab/face?img_file=" . $save_file . "&" . $params;
				$res_key = 'faces';
				break;
			case 'object_detect':
				$url = "http://www.yanjingang.com:8026/piglab/image/object_detect?img_file=" . $save_file . "&" . $params;
				break;
			case 'chess-board':
				$url = "http://www.yanjingang.com:8024/piglab/game/chess_board?img_file=" . $save_file . "&" . $params;
				break;
		}
		if ($url == '') {
			$result['status'] = 5;
			$result['msg'] = 'invalid type param!!' . $res['code'] . ' ' . $res['msg'];
		} else {
			$res = file_get_contents($url);
			$res = json_decode($res, true);
			if ($res['code'] != 0) {
				$result['status'] = 4;
				$result['msg'] = 'infer fail!' . $res['code'] . ' ' . $res['msg'];
			} else {
				$result['data'][$res_key] = $res['data'];
				$result['data']['requrl'] = $url;
				$result['data']['url'] = str_replace($PATH, $URL, $save_file);
			}
		}
	}
}

header("Content-type: application/json");
echo json_encode($result);
