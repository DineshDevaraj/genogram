<!-- useract : check is the user account is activated or not -->

<?php session_start(); ?>

<?php
	if(!isset($_SESSION['id'])){
		header('location:index.php');
		return;
	}
?>

<?php
	require("cypher.php");
	$Id=(int)$_SESSION['id'];
	if(!CQuery::client()->getNode($Id)->getProperty('active')){
		header('location:newuser.php');
		return;
	}else{
		$_SESSION['active']=1;
		header('location:loaduser.php');
		return;
	}
?>
