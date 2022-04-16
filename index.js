
function OnSiginTabClick(data){
	$(".forms input[class=su]").css('z-index', 1);
	$(".signup").css('display', 'none');
	//$(".signin").slideDown('fast');
	$(".signin").css('display', 'inherit');
	$('.signin form [name=useremail]').focus();
}

function OnSignupTabClick(data){
	$(".forms input[class=su]").css('z-index', 2);
	$(".signin").css('display', 'none');
	//$(".signup").slideDown('fast');
	$(".signup").css('display', 'inherit');
	$('.signup form [name=name]').focus();
}

function AppendError(obj, code){
	errMsg='<tr><td>';
	switch(code){
		case 'nl': errMsg+='Name is too long'; break;
		case 'ns': errMsg+='Name is too short'; break;
		case 'ne': errMsg+='Name cannot be empty'; break;

		case 'ei': errMsg+='Email is not valid'; break;
		case 'el': errMsg+='Email is too long'; break;
		case 'es': errMsg+='Email is too short'; break;
		case 'ee': errMsg+='Email cannot be empty'; break;
		case 'en': errMsg+='Given email is not registered'; break;
		case 'ex': errMsg+='Given email already registered'; break;

		case 'pl': errMsg+='Pasword is too long'; break;
		case 'ps': errMsg+='Pasword is too short'; break;
		case 'pm': errMsg+='Password did not match'; break;
		case 'pe': errMsg+='Password cannot be empty'; break;

		case 'rn' : errMsg+='Re-entered password not equal'; break;
		case 're' : errMsg+='Re-entered password cannot be empty'; break;

		default: errMsg+='Error while login please try later';
	}
	errMsg+='</td></tr>';
	obj.append(errMsg);
}

function EmailValid(email){
	var atpos=email.indexOf("@");
	var dotpos=email.lastIndexOf(".");
	return atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length;
}
	
function OnSigninClick(data){

	$('.signin .error form').empty();
	$('.signin .error form').append('<table>');

	msg=$('.signin .error table');
	pwd=$('.signin form [name=password]').val();
	email=$('.signin form [name=useremail]').val();

	err=0;

	if(!email)
		(err=1) && AppendError(msg, 'ee');
	else if(email.length<7)
		(err=1) && AppendError(msg, 'es');
	else if(email.length>50)
		(err=1) && AppendError(msg, 'el');
	else if(EmailValid(email))
		(err=1) && AppendError(msg, 'ei');

	if(!pwd)
		(err=1) && AppendError(msg, 'pe');
	else if(pwd.length<4)
		(err=1) && AppendError(msg, 'ps');
	else if(pwd.length>25)
		(err=1) && AppendError(msg, 'pl');
		
	if(err) $('.signin form [name=useremail]').select();

	return !err;
}

function OnSignupClick(data){

	$('.signup .error form').empty();
	$('.signup .error form').append('<table>');

	msg=$('.signup .error table');
	name=$('.signup form [name=name]').val();
	email=$('.signup form [name=email]').val();

	err=0;

	if(!name)
		(err=1) && AppendError(msg, 'ne');
	else if(name.length<3)
		(err=1) && AppendError(msg, 'ns');
	else if(name.length>25)
		(err=1) && AppendError(msg, 'nl');
		
	if(!email)
		(err=1) && AppendError(msg, 'ee');
	else if(email.length<7)
		(err=1) && AppendError(msg, 'es');
	else if(email.length>50)
		(err=1) && AppendError(msg, 'el');
	else if(EmailValid(email))
		(err=1) && AppendError(msg, 'ei');
		
	if(err) $('.signup form [name=name]').select();

	return !err;
}

function InitJQuery(){
	$("form [value=Signin]").click(OnSigninClick);
	$("form [value=Signup]").click(OnSignupClick);
	$(".forms input[class=si]").click(OnSiginTabClick);
	$(".forms input[class=su]").click(OnSignupTabClick);
	$('.signin form [name=useremail]').focus();
}