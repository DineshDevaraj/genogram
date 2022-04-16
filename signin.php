<?php session_start(); ?>

<?php
	$pwd=$_POST['password'];
	$uem=strtolower($_POST['useremail']);

	$data='';
	if(!$uem) $data.='ee+';
	else if(strlen($uem)<7) $data.='es+';
	else if(strlen($uem)>50) $data.='el+';
	else if(!filter_var($uem, FILTER_VALIDATE_EMAIL)) $data.='ei+';

	if(!$pwd) $data.='pe';
	else if(strlen($pwd)<4) $data.='ps';
	else if(strlen($pwd)>25) $data.='pl';

	if($data){
		// lge : login error
		header('location:index.php?lge='.$data);
		return;
	}else{

		require("cypher.php");

		// check if email registered
		// $qChk : cypher query to check email
		$qChk=new CQuery(
			'START n=node(*) '.
			'WHERE n.email! = "'.$uem.'" '.
			'RETURN id(n) as id, n.hash as hash'
		);

		if(!count($qChk->rObj)){
			header('location:index.php?lge=en');
			return;
		}else if(strtoupper(md5($pwd))!=$qChk->rObj[0]['hash']){
			header('location:index.php?lge=pm');
			return;
		}else{
			$_SESSION['id']=$qChk->rObj[0]['id'];
			header('location:usract.php');
			return;
		}
	}
?>