<?php session_start(); ?>

<?php
	if(!isset($_SESSION['active'])){
		header('location:index.php');
		return;
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<title>...::: Genogram :::...</title>
		
		<script src='vivagraph.js'></script>
		<script src='jquery-1.9.1.min.js'></script>
		<script src='loaduser.js'></script>		
		<script type="text/javascript" src="zebra_datepicker/zebra_datepicker.src.js"></script>
		
		<link rel='stylesheet' type='text/css' href='elements.css'/>
		<link rel='stylesheet' type='text/css' href='loaduser.css'/>	
		<link rel="stylesheet" href="zebra_datepicker/default.css" type="text/css">		
	</head>
	<body onload='OnPageLoad(<?php echo $_SESSION['id']; ?>)'>
		<div class='funcPanel'><?php
			$func=array('add', 'link', 'merge', 'mail', 'inform', 'search', 'delete', 'logout');
			foreach($func as $ent)
				echo "<img name='$ent' src='images/$ent.png'/><br/>";
		?></div>
		<div class='infoTray'>
			<img src='images/profile.png' alt='Profile : Unable to load'/>
		</div>
		<div class='infoPanel'>
			<form><table>
				<tr><td rowspan=4><img src='images/add.png'/></td><td>Name</td></tr>
				<tr><td><input disabled type='text' name='name'/></td></tr>
				<tr><td>Alias</td></tr>
				<tr><td><input disabled type='text' name='alias'/></td></tr>
				<tr><td>Birth Date</td><td><input type='text' name='birth_date' disabled /></td></tr>
				<tr><td>Gender</td><td><input type=radio name=gender value=male disabled >Male</input><input type=radio name=gender value=female disabled >Female</input></td></tr>
				<tr><td>Marital Status</td><td><input type=radio name=marital_status value=single disabled >Single</input><input type=radio name=marital_status value=married disabled >Married</input></td></tr>
			<?php
				$field=array('Mobile', 'Company', 'Designation', 'Birth Place', 'Grownup at', 'Current Place', 'College', 'High School', 'Pre High School', 'Email', 'Skype', 'Facebook', 'LinkedIn', 'Twitter', 'Google Plus', 'Picasa', 'YouTube', 'Blog', 'Website', 'Religion', 'Cast', 'Community', 'Family');
				foreach($field as $ent)
					echo "<tr><td>$ent</td><td><input type='text' name='".str_replace(' ', '_', strtolower($ent))."' disabled /></td></tr>";
			?>
				<tr><td>Native Address</td><td><textarea rows=3 name='native_address' disabled></textarea></td></tr>
				<tr><td>Current Address</td><td><textarea rows=3 name='current_address' disabled></textarea></td></tr>
				<tr><td/><td align=right><input type='button' class='btn btn-primary' value='Edit' style='margin-right:7px'/><input type='button' class='btn btn-primary' value='Cancel' style='margin-right:7px;display:none;'/><input type='button' class='btn btn-primary' value='Save' style='margin-right:7px;display:none;'/></td></tr>
			</table></form>
		</div>
		<div id='canvas'></div>		
		<script>InitJQuery()</script>
	</body>
</html>
