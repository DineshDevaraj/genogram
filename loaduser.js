
var which=0;

function OnNodePress(event){
	OnNodePress.enable=true;
}

function OnNodeDrag(event){
	if(OnNodePress.enable)
		OnNodeDrag.enable=true;
	return;
}

function OnNodeClick(event){

	//code=event.keyCode || event.charCode;
	//console.dir(window.KeyboardEvent());
	//console.log(which);
	event.preventDefault();
	var vn=event.target.parentNode.vn;
	
	if(event.ctrlKey){
		if(OnNodeDrag.enable)
			vn.isPinned=true;
		else vn.isPinned=!vn.isPinned;
	}
	else if('pair'!=vn.data){
		
		// show the profile details
		OnNodeClick.pf.populate(vn.id);
		
		if(83==which){
			if(vn.id!=OnNodePress.prevSelect.id){
				$('form[name=add-relation]').
				find('label[name=person]').
				text(vn.data).
				val(vn.id);
				$('form[name=merge-person]').
				find('label[name=dupe]').
				text(vn.data).
				val(vn.id);
			}else ShowError('Both person cannot be the same');
		}else{
			GetData(vn.id, event);
			OnNodePress.prevSelect=vn;
		}
		
	}

	OnNodeDrag.enable=false;
	OnNodePress.enable=false;

	return;
}

function StyleNode(node){

	var ui=Viva.Graph.svg('g').attr('class', 'node');

	if('pair'==node.data){
		var img=Viva.Graph.svg('image')
			.link('images/pair.png')
			.attr('width', 23)
			.attr('height', 28)
			.attr('clip-path', 'url(#clip)');
		ui.append(img);
	}else{
		// Calculate pixel width of the string
		tmp=document.createElement("span");
		tmp.innerHTML=node.data;
		el=document.getElementById('canvas');
		el.appendChild(tmp);
		var w=tmp.offsetWidth;
		var h=tmp.offsetHeight;
		el.removeChild(tmp);

		var rct = Viva.Graph.svg('rect')
			.attr('rx', 3)
			.attr('ry', 3)
			.attr('width', w+20)
			.attr('height', 25)
			.attr("fill", 'rgba(221, 160, 221, 0.5)')
			.attr('stroke-width', 1)
			.attr('stroke', '#C790C7');
		var txt = Viva.Graph.svg('text')
			.attr('x', '10px')
			.attr('y', '18px')
			.text(node.data);
		ui.append(rct);
		ui.append(txt);
	}

	ui.vn=node;
	//ui.addEventListener('click', GetData);
	ui.addEventListener('click', OnNodeClick);
	ui.addEventListener('mousemove', OnNodeDrag);
	ui.addEventListener('mousedown', OnNodePress);

	//console.dir(ui);

	return ui;
}

function StyleLink(link){
	var line=Viva.Graph.svg('path');
	switch(link.data.type){
		case 'son':
			line.attr('stroke', 'blue');
			line.attr('marker-end', 'url(#blue)');
			break;
		case 'doughter':
			line.attr('stroke', 'green');
			line.attr('marker-end', 'url(#green)');
			break;
		case 'wife':
			line.attr('stroke', 'fuchsia');
			line.attr('marker-end', 'url(#fuchsia)');
			break;
		case 'husband':
			line.attr('stroke', 'red');
			line.attr('marker-end', 'url(#red)');
			break;
		default:
			line.attr('stroke', 'black');
			line.attr('marker-end', 'url(#black)');
	}
	line.vl=link;
	return line;
}

function SetNodePos(ui, pos){
	w=ui.childNodes[0].width.baseVal.value;
	h=ui.childNodes[0].height.baseVal.value;
	ui.attr('transform', 'translate(' +
		(pos.x-w/2) + ',' + (pos.y-h/2) + ')');
}

function SetLinkPos(ui, f, t){

	var gh=OnPageLoad.gh;
	var geom = Viva.Graph.geom();

	var fn=Object();
	fn.w=gh.getNode(ui.vl.fromId).ui.childNodes[0].width.baseVal.value;
	fn.h=gh.getNode(ui.vl.fromId).ui.childNodes[0].height.baseVal.value;

	var tn=Object();
	tn.w=gh.getNode(ui.vl.toId).ui.childNodes[0].width.baseVal.value;
	tn.h=gh.getNode(ui.vl.toId).ui.childNodes[0].height.baseVal.value;

	var from = geom.intersectRect(
		// rectangle:
		f.x - fn.w / 2, // left
		f.y - fn.h / 2, // top
		f.x + fn.w / 2, // right
		f.y + fn.h / 2, // bottom
		// segment:
		f.x, f.y, t.x, t.y)
	// if no intersection found - return center of the node
	|| f;

	var to = geom.intersectRect(
	// rectangle:
	t.x - tn.w / 2, // left
	t.y - tn.h / 2, // top
	t.x + tn.w / 2, // right
	t.y + tn.h / 2, // bottom
	// segment:
	t.x, t.y, f.x, f.y)
	|| t; // if no intersection found - return center of the node

	var data = 	'M' + from.x + ',' + from.y +
					'L' + to.x + ',' + to.y;
	ui.attr("d", data);

	return;
}

function LoadNode(data){

	var gh=OnPageLoad.gh;
	var ajax=data.target;

	if(ajax.readyState==4 && ajax.status==200){
		var i;
		console.log(ajax.responseText);
		data=eval('('+ajax.responseText+')');
		for (i = 0; i < data.nodes.length; ++i)
			if(!gh.getNode(data.nodes[i].id))
				gh.addNode(data.nodes[i].id, data.nodes[i].data);
		for (i = 0; i < data.links.length; ++i){
			var link = data.links[i];
			gh.addLink(link.source, link.target, link.data);
		}
	}

	return;
}

function GetData(Id, Event){

	if(Event){
		if(!Event.ctrlKey &&
		!OnNodeDrag.enable &&
		!Event.target.status){
			GetData.ajax.open('GET', 'query.php?id='+Id, true);
			Event.target.status='shown';
			GetData.ajax.send();
		}
	}else{
		GetData.ajax.open('GET', 'query.php?id='+Id, true);
		GetData.ajax.send();
	}

	return;
}

function OnPageLoad(Id){

	var ajax;
	var gh=Viva.Graph.graph();

	var ghs=Viva.Graph.View.svgGraphics();
	ghs.node(StyleNode).placeNode(SetNodePos);
	ghs.link(StyleLink).placeLink(SetLinkPos);

	var renderer = Viva.Graph.View.renderer(gh, {
		graphics : ghs,
		container : document.getElementById('canvas')
	});
	renderer.run();

	var defs = ghs.getSvgRoot().append('defs');

	var clip=Viva.Graph.svg('rect')
		.attr('rx', 5)
		.attr('ry', 5)
		.attr('width', 23)
		.attr('height', 28);
	defs.append('clipPath').attr('id', 'clip').append(clip);

	function Marker(colour) {
		arw=Viva.Graph.svg('marker')
			.attr('id', colour)
			.attr('viewBox', "0 0 10 10")
			.attr('refX', "10")
			.attr('refY', "5")
			.attr('markerUnits', "strokeWidth")
			.attr('markerWidth', "20")
			.attr('markerHeight', "10")
			.attr('orient', "auto")
			.attr('fill', colour);
		arw.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');
		defs.append(arw);
		return;
	}
	colours=new Array('red', 'green', 'blue', 'fuchsia', 'black');
	colours.forEach(Marker);

	if(window.XMLHttpRequest)
		ajax=new XMLHttpRequest();
	else ajax=new ActiveXObject('Microsoft.XMLHTTP');
	ajax.onreadystatechange=LoadNode;
	GetData.ajax=ajax;

	OnPageLoad.css=ghs;
	OnPageLoad.gh=gh;
	GetData(Id);

	//console.log(ghs.transformName);

	return;
}

function GraphToJson(){
	var slzr=new Viva.Graph.serializer();
	var json=slzr.storeToJSON(OnPageLoad.gh);
	console.log(json);
	return;
}

function AddPopover(data, title, content){

	InitFunctionPanel();
	trg=$(data.target);
	trg.unbind('click');
	$('body').append(
		"<div class='popover fade right in'>\
			<div class='arrow'></div>\
			<div class='popover-inner'>\
				<div class='popover-title'>\
					<span>"+title+"</span>\
					<img class='close' src='images/close.png'/>\
				</div>\
				<div class='popover-content'>"+content+"</div>\
			</div>\
		</div>"
	);

	trgw=trg.width();
	trgh=trg.height();
	trgy=trg.offset().top;
	trgx=trg.offset().left;

	pop=$('.popover');

	popw=pop.width();
	poph=pop.height();

	pop.css('left', trgx+trgw+7);
	pop.css('top', trgy+(trgh-poph)/2);

	$('.popover .popover-title span').css('width', popw-53);

	pop.width(0);
	pop.animate({'width':popw}, 'fast');

	caller=AddPopover.caller;
	$('.popover .popover-title img').click(function(data){
		pop.remove();
		trg.click('click', caller);
	});

	return;
}

function ShowError(err){
	$('body').append(
	"<div class='flash-message' style='position:fixed;z-index:2;'>\
		<h1>"+(err?err:"Select a person to perform the operation")+"<h1>\
	</div>");
	msgDiv=$('.flash-message');
	msgDiv.css('top', 50);
	msgDiv.css('left', ($('body').width()-msgDiv.width())/2);
	msgDiv.css('background', 'yellow');
	msgDiv.css('border', '1px solid black');
	msgDiv.css('border-radius', 5);
	msgDiv.css('padding', 5);
	msgDiv.delay(1000).animate({opacity:0}, 'fast', function(){
		msgDiv.remove();
	});
}

function AddPerHook(resp){
	//console.log(resp);
	GetData(OnNodePress.prevSelect.id);
}

function AddPerson(event){
	data=$('form[name=add-person]').serialize()+
			'&pr=ap'+'&sid='+OnNodePress.prevSelect.id;
	$.post('functions.php', data, AddPerHook);
	return false;
}

var sel=	"<select name='relation'>\
				<option style='color:black;background:lightgray' disabled>Children</option>\
				<option value='Son'>Son</option>\
				<option value='Doughter'>Doughter</option>\
				<option style='color:black;background:lightgray' disabled>Parents</option>\
				<option value='Father'>Father</option>\
				<option value='Mother'>Mother</option>\
				<option style='color:black;background:lightgray' disabled>Siblings</option>\
				<option value='Sister'>Sister</option>\
				<option value='Brother'>Brother</option>\
				<option style='color:black;background:lightgray' disabled>Marital</option>\
				<option value='Wife'>Wife</option>\
				<option value='Husband'>Husband</option>\
			</select>";

function OnAddPersonClick(data){

	if(!OnNodePress.prevSelect){
		ShowError();
		return;
	}

	title='Add new person to '+OnNodePress.prevSelect.data;
	content="<form name='add-person'><table>\
					<tr><td>Name</td><td><input name='name' class='text' type='text'></td></tr>\
					<tr><td>Relation</td><td>"+
					sel+"</td></tr>\
					<tr><td colspan='2' align='right'><input class='btn btn-primary' type='submit' value='Add' onclick='return AddPerson(event)'/></td></tr>\
				</table></form>";
	AddPopover(data, title, content);
	return;
}

function AddRelHook(resp){
	//console.log(resp);
	GetData(OnNodePress.prevSelect.id);
}

function AddRelation(ev){
	data=$('form[name=add-relation]').serialize()+
			'&pr=ar'+'&sid='+OnNodePress.prevSelect.id+
			'&tid='+$('form[name=add-relation]').
				find('label[name=person]').
				val();
	//console.log(data);
	$.post('functions.php', data, AddRelHook);
	return false;
}

function OnAddLinkClick(data){

	if(!OnNodePress.prevSelect){
		ShowError();
		return;
	}

	title='Add relation to '+OnNodePress.prevSelect.data;
	content="<form name='add-relation'><table>\
					<tr><td>Person</td><td><label class='label' name='person'>Select the person to relate</label></td></tr>\
					<tr><td>Relation</td><td>"+
					sel+"</td></tr>\
					<tr><td colspan='2' align='right'><input class='btn btn-primary' type='submit' value='Add' onclick='return AddRelation(event)'/></td></tr>\
				</table></form>";
	AddPopover(data, title, content);
	return;
}

function MerPerHook(resp){
	var gh=OnPageLoad.gh;
	var links=gh.getNode(MergePerson.tid).links;
	for (Idx in links)
		gh.removeLink(links[Idx]);
	gh.removeNode(MergePerson.tid);
	GetData(OnNodePress.prevSelect.id);
}

function MergePerson(ev){
	MergePerson.tid=$('form[name=merge-person]').
			find('label[name=dupe]').
			val();
	data=$('form[name=merge-person]').serialize()+
		'&pr=mp'+'&sid='+OnNodePress.prevSelect.id+
		'&tid='+MergePerson.tid;
	console.log(data);
	$.post('functions.php', data, MerPerHook);
	return false;
}

function OnMergePersonClick(data){

	if(!OnNodePress.prevSelect){
		ShowError();
		return;
	}

	title='Merge duplicates of '+OnNodePress.prevSelect.data;
	content="<form name='merge-person'><table>\
					<tr><td><label class='label' name='dupe'>Select the duplicate</label></td></tr>\
					<tr><td align='right'><input class='btn btn-primary' type='submit' value='Merge' onclick='return MergePerson(event)'/></td></tr>\
				</table></form>";
	AddPopover(data, title, content);
	return;
}

function OnSendMessageClick(data){

	if(!OnNodePress.prevSelect){
		ShowError();
		return;
	}

	title='Send message to '+OnNodePress.prevSelect.data;
	content="<form><table>\
					<tr><td>Message</td></tr>\
					<tr><td><textarea rows='5' name='msg'/></td></tr>\
					<tr><td align='right'><input class='btn btn-primary' type='submit' value='Send'/></td></tr>\
				</table></form>";
	AddPopover(data, title, content);
	return;
}

function DelPerHook(resp){
	var gh=OnPageLoad.gh;
	var links=gh.getNode(OnNodePress.prevSelect.id).links;
	for (Idx in links) gh.removeLink(links[Idx]);
	gh.removeNode(OnNodePress.prevSelect.id);
}

function DeletePerson(data){
	// post data string
	pStr='pr=dp&id='+OnNodePress.prevSelect.id;
	$.post('functions.php', pStr, DelPerHook);
	$('.popover .popover-title img').trigger('click');
	return false;
}

function CancelDeletePerson(data){
	$('.popover .popover-title img').trigger('click');
	return false;
}

function OnDeletePersonClick(data){
	if(!OnNodePress.prevSelect){
		ShowError();
		return;
	}
	title='Delete '+OnNodePress.prevSelect.data;
	content="<form><table>\
					<tr><td colspan=2>Are you sure you want to delete this person?</td></tr>\
					<tr><td/><td align=right><input class='btn btn-primary' type=submit onclick='return DeletePerson(event)' value='Yes'/><input class='btn btn-primary' type=submit onclick='return CancelDeletePerson(event)' value='No'/></td></tr>\
				</table></form>";
	AddPopover(data, title, content);
	return;
}

function OnLogoutClick(data){
	window.location='logout.php';
	return;
}

function OnProfileClick(ev){
	if(!OnNodePress.prevSelect){
		ShowError();
		return;
	}
	OnProfileClick.pf.toggle();	
}

function InitProfile(){
	
	pf={}; // profile
	show=false;
	panl=$('.infoPanel');
	form=$('.infoPanel form');
	edit=$('.infoPanel [value=Edit]');
	save=$('.infoPanel [value=Save]');
	cncl=$('.infoPanel [value=Cancel]');
	flds=$('.infoPanel :disabled[value!=Edit]');
	
	// initializing date picker
	date=$('.infoPanel [name=birth_date]');
	date.addClass('datepicker');
	date.Zebra_DatePicker({
		format:'d M Y',
		offset:[-222, 23]
	});
	icon=$('.infoPanel .Zebra_DatePicker_Icon');
	icon.css({display: '', top:10});
	
	pf.enable=function(){
		flds.prop('disabled', false);
		icon.removeClass('Zebra_DatePicker_Icon_Disabled');
	}
	pf.disable=function(){
		edit.show();
		save.hide();
		cncl.hide();
		flds.prop('disabled', true);
		icon.addClass('Zebra_DatePicker_Icon_Disabled');
	}
	pf.toggle=function(){
		show=!show;
		if(show) pf.disable();
		panl.slideToggle('fast');
	}
	pf.populate=function(Id){
		pf.disable();
		flds.filter('[type!=radio]').val('');
		$.post('functions.php', 
		'pr=info&id='+Id, function(data){
			data=data.trim();
			info=$.parseJSON(data);			
			for(fld in info){
				if('gender'!=fld && 'marital_status'!=fld) 
					flds.filter('[name='+fld+']').val(info[fld]);
				else flds.filter('[value='+info[fld]+']').prop('checked', true);
			}
		});
	}
	edit.click(function(ev){
		pf.enable();
		edit.hide();
		cncl.show();
		save.show();
		return false;
	})
	save.click(function(ev){
		$.post('functions.php', 
		form.serialize()+'&id='+OnNodePress.prevSelect.id+'&pr=sp', 
		function(data){
			data=data.trim();
			console.log(data);
			pf.disable();
		})
		return false;
	})
	cncl.click(function(ev){
		pf.disable();
		pf.populate(OnNodePress.prevSelect.id);
		return false;
	})
	OnNodeClick.pf=pf;
	OnProfileClick.pf=pf;	
	
	return pf;
}

function InitFunctionPanel(){
	$('.popover').remove();
	$(".funcPanel img").unbind('click');
	$(".funcPanel img[name='add']").click(OnAddPersonClick);
	$(".funcPanel img[name='link']").click(OnAddLinkClick);
	$(".funcPanel img[name='merge']").click(OnMergePersonClick);
	$(".funcPanel img[name='mail']").click(OnSendMessageClick);
	$(".funcPanel img[name='logout']").click(OnLogoutClick);
	$(".funcPanel img[name='delete']").click(OnDeletePersonClick);
}

function InitJQuery(){
	InitProfile();
	InitFunctionPanel();
	$(".infoTray img").click(OnProfileClick);
}

document.onkeyup=function(event){which=0}
document.onkeydown=function(event){which=event.which}