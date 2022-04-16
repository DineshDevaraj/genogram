
function AppendError(code){
	var errMsg='';
	var codeArr=code.split('+');
	for(Idx in codeArr){
		switch(codeArr[Idx].trim()){
			case ''	: break;
			case 'pl': errMsg+='Pasword is too long<br/>'; break;
			case 'ps': errMsg+='Pasword is too short<br/>'; break;
			case 'pe': errMsg+='Password cannot be empty<br/>'; break;
			case 'rn': errMsg+='Re-entered password not equal<br/>'; break;
			case 're': errMsg+='Re-entered password cannot be empty'; break;
			default 	: errMsg+='Unknown error code<br/>';
		}
	}
	$('form div[class=err-message]').empty().append(errMsg);
}

function ResponseHandle(resp){	
	if("verified"==resp.trim())
		window.location='loaduser.php';		
	AppendError(resp);
	$('form div[class=err-title]').css('display', 'inherit');	
	$('input[name=pwd]').select();
}

function OnSubmitClick(data){	
	
	err='';
	pwd=$('input[name=pwd]').val();
	repwd=$('input[name=repwd]').val();
	
	if(!pwd) err+='pe+';
	else if(pwd.length<4) err+='ps+';
	else if(pwd.length>25) err+='pl+';

	if(!repwd) err+='re';
	else if(pwd!=repwd) err+='rn';
	
	if(err){
		AppendError(err);
		$('form div[class=err-title]').css('display', 'none');	
		$('input[name=pwd]').select();
	}else $.post('newpwd.php', $('form').serialize(), ResponseHandle);
	
	return false;
}

function InitJQuery(){
	$('input[type=submit]').click(OnSubmitClick);
	$('input[name=pwd]').focus();
}