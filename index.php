<?php session_start(); ?>

<?php
	// check if logged in
	if(isset($_SESSION['id'])){
		header('Location:usract.php');
		return;
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<title>...::: Session :::...</title>
		<link rel='stylesheet' type='text/css' href='elements.css'></link>
		<link rel='stylesheet' type='text/css' href='index.css'></link>
		<script src='jquery-1.9.1.min.js'></script>
		<script src='index.js'></script>
	</head>
	<body>
		<?php
			function GetErrMsg($errStr){
				$errMsg='';
				$errArr=explode(' ', $errStr);
				foreach($errArr as $err){
					$errMsg.='<tr><td>';
					switch($err){
						case ''	 : break;
						case 'nl' : $errMsg.='Name is too long'; break;
						case 'ns' : $errMsg.='Name is too short'; break;
						case 'ne' : $errMsg.='Name cannot be empty'; break;

						case 'ei' : $errMsg.='Email is not valid'; break;
						case 'el' : $errMsg.='Email is too long'; break;
						case 'es' : $errMsg.='Email is too short'; break;
						case 'ee' : $errMsg.='Email cannot be empty'; break;
						case 'en' : $errMsg.='Given email is not registered'; break;
						case 'ex' : $errMsg.='Given email already registered'; break;

						case 'pl' : $errMsg.='Pasword is too long'; break;
						case 'ps' : $errMsg.='Pasword is too short'; break;
						case 'pm' : $errMsg.='Password did not match'; break;
						case 'pe' : $errMsg.='Password cannot be empty'; break;

						case 'rn' : $errMsg.='Re-entered password not equal'; break;
						case 're' : $errMsg.='Re-entered password cannot be empty'; break;

						default: $errMsg.='Error while login please try later';
					}
					$errMsg.='</td></tr>';
				}
				return $errMsg;
			}

			if(isset($_GET['lgs']))
				echo 'Signup success. One time login password send to your email.'.
				' Use that password and your email to signin.';
		?>
		<div class='outer'>
			<div class='title'>genetree</div>
			<div class='forms'>
				<input class='si' type='button' value='Signin'/>
				<input class='su' type='button' value='Signup'/>
				<div class='content'>
					<div class='signin'>
					<div class='error'>
						<form><table>
							<?php
								if(isset($_GET['lge']))
									echo 'Sever side validation'.GetErrMsg($_GET['lge']);
							?>
						</table></form>
					</div>
					<form action='signin.php' method='post'><table>
						<tr><td>Email</td><td><input type='text' name='useremail'/></td></tr>
						<tr><td>Passsword</td><td><input type='password' name='password'/></td></tr>
						<tr><td colspan='2' align='right'><input class='btn btn-success' type='submit' value='Signin'/></td></tr>
					</table></form>			
				</div>
				<div class='signup'>
					<div class='error'>
						<form><table>
							<?php
								if(isset($_GET['spe']))
									echo 'Sever side validation'.GetErrMsg($_GET['spe']);
							?>
						</table></form>
					</div>
					<form action='signup.php' method='post'><table>
						<tr><td>Name</td><td><input type='text' name='name' /></td></tr>
						<tr><td>Gender</td><td>
							<input type='radio' name='gender' value='male' checked='checked'>Male</input>
							<input type='radio' name='gender' value='female'>Female</input>
						</td></tr>
						<tr><td>Email</td><td><input type='text' name='email' /></td></tr>
						<tr><td></td><td align='right'><input class='btn btn-primary' type='Submit' value='Signup'/></td></tr>
					</table></form>			
				</div>
				</div>
			</div>
		</div>
		<script>InitJQuery()</script>
		<?php
			if(isset($_GET['spe']))
				echo '<script>
					$(".forms input[class=su]").trigger("click");
				</script>';
		?>
	</body>
</html>