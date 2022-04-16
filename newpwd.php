<?php session_start(); ?>

<?php
	if(!isset($_SESSION['id'])){
		header('location:index.php');
		return;
	}else if(isset($_SESSION['active'])){
		header('location:loaduser.php');
		return;
	}
?>

<?php

	$data='';
	$pwd=$_POST['pwd'];
	$repwd=$_POST['repwd'];

	if(!$pwd) $data.='pe+';
	else if(strlen($pwd)<4) $data.='ps+';
	else if(strlen($pwd)>25) $data.='pl+';

	if(!$repwd) $data.='re';
	else if($pwd!=$repwd) $data.='rn';

	if($data) die($data);
	else{
		require("cypher.php");
		// $qSet : cypher query to set a member value
		$qSer=new CQuery(
			"START n=node($_SESSION[id]) ".
			"SET n.active=1 ".
			"SET n.hash='".strtoupper(md5($pwd))."'"
		);
		die('verified');
	}
?>