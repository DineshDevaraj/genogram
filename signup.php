<?php session_start(); ?>

<?php
	if(isset($_SESSION['id'])){
		header('location:usract.php');
		return;
	}
?>

<?php

	$name=$_POST['name'];
	$sex=$_POST['gender'];
	$email=$_POST['email'];

	// check if input are not empty and valid
	$data='';
	if($name=='') $data.='ne+';
	else if(strlen($name)<3) $data.='ns+';
	else if(strlen($name)>25) $data.='nl+';

	if($email=='') $data.='ee';
	else if(strlen($email)<7) $data.='es';
	else if(strlen($email)>50) $data.='el';
	else if(!filter_var($email, FILTER_VALIDATE_EMAIL)) $data.='ei';

	if($data){
		header('location:index.php?spe='.$data); // spe : signup error
		return;
	}

	require('cypher.php');

	// check if email id already registered
	// $qChk : cypher query to check email
	$qChk=new CQuery(
		'START n=node(*) '.
		'WHERE n.email! = "'.$email.'" '.
		'RETURN n'
	);

	if(count($qChk->rObj)){
		header('location:index.php?spe=ex');
		return;
	}
	else{
		// $qNew : cypher query to create new node
		// cn 	: common node
		$hStr=strtoupper(substr($name, 0, 4)).rand(); // hash string
		$hash=strtoupper(md5($hStr));
		$qNew=new CQuery("CREATE (cn{name:'pair'}) ".
		"CREATE (user{name:'$name', email:'$email', hash:'$hash',
		gender:'$sex', cown:'$email', pown:'$email', active:0}) ".
		"CREATE cn-[:".($sex=='male'?'son':'doughter')."]->user ".
		"RETURN id(user) as Id");
		
		// record the new user account to the root
		date_default_timezone_set("Asia/Kolkata");
		$date=date('d M Y');
		$time=date('g:i:s A');
		CQuery("START r=node(0) ".
		"CREATE r-[:user]->(new{name:'$name', date:'$date', 
		time:'$time', uid:'".$qNew->rObj[0]['Id']."'}) ".
		"SET new.index=r.count+1 ".
		"SET r.count=new.index");

		// email one time login password to the user
		$sub='Welcome to GeneTree!';
		$msg='Your one time login password is '.$hStr.
		'\n\nRgards,\n'.
		'GeneTree Team';
		$hdr='From:'.$email;
		mail($email,$sub,$msg,$hdr);

		header('location:index.php?lgs='.$hStr);
		return;
	}
?>