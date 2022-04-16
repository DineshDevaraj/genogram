<?php /* Client side page for newpwd.php */ ?>

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

<!DOCTYPE html>
<html>
	<head>
		<title>...::: GeneTree :::...</title>
		<script src='jquery-1.9.1.min.js'></script>
		<script src='newuser.js'></script>
		<link rel='stylesheet' type='text/css' href='elements.css'></link>
		<style>
			tr,td{
				height:35px;
			}
			input{
				width:240px;
				margin:auto;
				margin-left:10px;
			}
			form{
				width:325px;
				margin:auto;
				padding:10px 10px 5px 10px;
				box-shadow:0px 0px 10px 3px gray;
				background:white;
			}
			h1,h3{
				margin:0;
				padding:0;
				margin-bottom:5px;
			}
			h3{
				margin-left:5px;
				margin-bottom:13px;
			}
			.content{
				width:345px;
				margin:auto;
				margin-top:12.5%;				
			}
			body{
				background:url(images/canvas.jpg) fixed;
			}
			.err-title{
				color:blue;
				display:none;
				margin-left:75px;				
			}
			.err-message{
				color:red;
				margin-left:75px;
				margin-bottom:10px;
			}
		</style>
	<head>
	<body>
		<div class='content'>
			<h1>Welcome,</h1>
			<h3>Choose your new password</h3>	
			<form><table>			
				<div class='err-title'>Server side validation</div>
				<div class='err-message'></div>
				<tr><td>Password</td><td><input type='password' name='pwd'/></td></tr>
				<tr><td>Re-Enter</td><td><input type='password' name='repwd'/></td></tr>
				<tr><td align='right' colspan='2'><input type='submit' value='Submit' class='btn btn-primary'/></td></tr>
			</table></form>
		</div>
		<script>InitJQuery()</script>
	<body>
</html>