<?php require '../../auth/auth.php'; ?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>NLP接口测试</title>
		<script src="http://tools.yanjingang.com/js/jquery.min.js"></script>
	</head>
	<body>
		<table>
			<tr><td>标题：</td><td><input id=t  style="width: 360px;" value="nba历史里哪个球员的技术更全面？"/></td></tr>
			<tr><td>正文：</td><td><textarea id=c style="width: 360px;height: 150px;">奥拉朱旺 生涯总得分26946历史排名第七 总篮板13747历史排名第十(好像刚被呆子超了) 总盖帽3830历史排名第一 总抢断2162历史排名第八 总命中数10749历史排名第七 另外还有3058助攻 历史上唯一一个2000盖帽2000抢断的球员 历史上唯一一个四项数据排名进入历史前10（11）的球员 历史上四个拿到四双数据之一的球员之一</textarea></td></tr>
			<tr><td></td><td>
				<input type="button" id="submit_seg" value="切词&Term重要性"/>
				<input type="button" id="submit_keyword" value="关键词提取"/>
				<input type="button" id="submit_nnfeature" value="相似度NNFeature提取"/>
			</td></tr>
		</table>
		<p>
		<table>
			<tr><td id="seg_res"></td></tr>
			<tr><td id="keyword_res"></td></tr>
			<tr><td id="nnfeature_res"></td></tr>
		</table>
		<script>
			$(function() {
				var url = "http://lab.yanjingang.com";
				$("#submit_seg").bind("click", function() {
					var title = $("#t").val();
					$.ajax({
						type: "GET",
						url: url+":8011/nlp/seg?t="+title,
						data: {},
						success: function(data) {
							console.log(data);
							$("#seg_res").html("基本词切分&Term重要性：<br>&nbsp;&nbsp;"+data.data.seg + '<p>'+"混排词切分&Term重要性：<br>&nbsp;&nbsp;"+data.data.seg_phrase+ '<p>')
						}
					});
				});
				$("#submit_keyword").bind("click", function() {
					var title = $("#t").val();
					var content = $("#c").val();
					$.ajax({
						type: "GET",
						url: url+":8012/nlp/keyword?t="+title+"&c="+content,
						data: {},
						success: function(data) {
							console.log(data);
							$("#keyword_res").html("关键词提取：<br>&nbsp;&nbsp;"+data.data.keyword+ '<p>')
						}
					});
				});
				$("#submit_nnfeature").bind("click", function() {
					var title = $("#t").val();
					$.ajax({
						type: "GET",
						url: url+":8015/nlp/nnfeature?t="+title,
						data: {},
						success: function(data) {
							console.log(data);
							$("#nnfeature_res").html("相似度特征提取：<br>&nbsp;&nbsp;"+data.data.feature+ '<p>')
						}
					});
				});
			});
		</script>
	</body>
</html>
