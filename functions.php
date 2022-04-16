<?php session_start() ?>

<?php /* validation */
	if(!isset($_SESSION['active']) ||
	!isset($_SESSION['id'])) die('improper access');
?>

<?php /* initialization */
	require('cypher.php');
	if(!isset($_SESSION['user'])){
		$usr=CQuery(
			"START n=node($_SESSION[id]) ".
			"RETURN n.cown as user"
		);
		$_SESSION['user']=$usr->rObj[0]['user'];
	}
?>

<?php /* AddPerson() function defenitions */	
	function AddPerson(){
		$name=$_POST['name'];
		$rel=strtolower($_POST['relation']);
		$sex=('father'==$rel||'son'==$rel||
				'brother'==$rel||'husband'==$rel)?
				'male':'female';
		$qNew=CQuery(
			"CREATE (n{name:'$name', 
						gender:'$sex',
						cown:'$_SESSION[user]'}) ".
			"RETURN id(n) as nid"
		);
		$_POST['tid']=(int)$qNew->rObj[0]['nid'];
		AddRelation();
		return 'a'.$_POST['relation'][0].'s';
	}
?>

<?php	/* AddRelation() function defenition */
	function AddRelation(){
		$sid=$_POST['sid']; // source person Id
		$tid=$_POST['tid']; // target person Id
		$rel=strtolower($_POST['relation']);
		if('father'==$rel||'mother'==$rel||
			'brother'==$rel||'sister'==$rel){
			/* check if parent common node exist */
			$cnx=CQuery(
				"START n=node($sid) ".
				"MATCH n<-[?]-c ".
				"RETURN c, n.gender as gender"
			);
			if(!$cnx->rObj[0]['c'])
				CQuery( // create common node
					"START n=node($sid) ".
					"CREATE n<-[:".
						('male'==$cnx->rObj[0]['gender']?
						'son':
						'doughter')
					."]-({name:'pair'})"
				);
			/* get parent common node and add the parent */
			$qStr="START n=node($sid), t=node($tid) ".
					"MATCH n<--c ".
					"CREATE t";			
			if('sister'==$rel) CQuery($qStr."<-[:doughter]-c");
			else if('brother'==$rel) CQuery($qStr."<-[:son]-c");
			else if('mother'==$rel) CQuery($qStr."-[:wife]->c");
			else CQuery($qStr."-[:husband]->c");
		}else if('son'==$rel||'doughter'==$rel||
					'wife'==$rel||'husband'==$rel){
			/* check if children common node exist */
			$cnx=CQuery(
				"START n=node($sid) ".
				"MATCH n-[?]->c ".
				"RETURN c, n.gender as gender"
			);
			if(!$cnx->rObj[0]['c']){
				CQuery(// create common node
					"START n=node($sid) ".
					"CREATE n-[:".
						('female'==$cnx->rObj[0]['gender']?
						'wife':
						'husband')
					."]->({name:'pair'})"
				);
			}
			/* get children common node and add the child */
			$qStr="START n=node($sid), t=node($tid) ".
				"MATCH n-->c ".
				"CREATE t";
			if('wife'==$rel||'husband'==$rel) 
				CQuery($qStr."-[:$rel]->c");
			else CQuery($qStr."<-[:$rel]-c");
		}
		return 'ars'; // adding relation success
	}
?>

<?php /* MergePerson() function defenition */
	function MergePerson(){		
		$sid=$_POST['sid']; // source person Id
		$tid=$_POST['tid']; // target person Id
		// get the common nodes
		$gcn=CQuery(
			"START n=node($tid) ".
			"MATCH p-[pr?]->n-[cr?]->c ".
			"RETURN id(p) as pid, type(pr) as prt, ".
			"id(pr) as pri, type(cr) as crt, id(c) as cid, id(cr) as cri"
		);
		$pid=$gcn->rObj[0]['pid']; // parent common node Id
		$cid=$gcn->rObj[0]['cid']; // children common node Id
		$prt=$gcn->rObj[0]['prt']; // parent relationship type
		$crt=$gcn->rObj[0]['crt']; // children relationship type
		$pri=$gcn->rObj[0]['pri'];	// parent relationship id
		$cri=$gcn->rObj[0]['cri']; // parent relationship id
		if($pid){
			CQuery(
				"START s=node($sid), p=node($pid), r=relationship($pri) ".
				"CREATE s<-[:$prt]-p DELETE r"
			);
		}
		if($cid){
			CQuery(
				"START s=node($sid), c=node($cid), r=relationship($cri) ".
				"CREATE s-[:$crt]->c DELETE r"
			);
		}
		CQuery(
			"START n=node($tid) ".
			"DELETE n"
		);
		return 'ms';
	}
?>

<?php /* DeletePerson() function defenition */
	function DeletePerson(){
		CQuery(
			"START n=node($_POST[id]) ".
			"MATCH ()-[pr?]->n-[cr?]->() ".
			"DELETE pr, cr ".
			"DELETE n"
		);
		return 'pds'; // person delete success
	}
?>

<?php
	function PersonInfo(){
		$info=CQuery(
			"START n=node($_POST[id]) ".
			"RETURN n"
		);
		$prop=$info->rObj[0]['n']->getProperties();
		return json_encode($prop);
	}
?>

<?php
	function SaveProfile(){	
		$cqs="START n=node($_POST[id])"; // cypher query string
		unset($_POST['id']); unset($_POST['pr']);
		foreach($_POST as $key => $val)
			if($val!='') $cqs.=" "."SET n.$key=\"$val\"";
		CQuery($cqs);
		return 'ss'; // save success
	}
?>

<?php
	$resp='';
	$pr=$_POST['pr']; // process
	switch($pr){
		case 'ap' : /* add a new person */
			$resp=AddPerson();
			break;
		case 'ar' : /* add a new relation between existing persons */
			$resp=AddRelation();
			break;
		case 'mp' : /* merge duplicate of a person */
			$resp=MergePerson();
			break;
		case 'dp' : /* delete a person */
			$resp=DeletePerson();
			break;
		case 'info' : /* get info of the person */
			$resp=PersonInfo();
			break;
		case 'sp' : /* save profile */
			$resp=SaveProfile();
			break;
	}
	die($resp);
?>