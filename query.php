<?php

	require("cypher.php");

	class nodeClass{
		var $id;
		var $data;
		function __construct($id, $data){
			$this->id=$id;
			$this->data=$data;
		}
	};

	class linkClass{
		var $source;
		var $target;
		var $data;
		function __construct($fid, $tid, $data){
			$this->source=$fid;
			$this->target=$tid;
			$this->data=$data;
		}
	};

	$Id=(int)$_GET['id'];
	
	// qGrn : cypher query to get related nodes
	$qGrn=new CQuery(
		'START n=node('.$Id.') '.
		'MATCH n-[r1]-n1-[r2?]-n2 '.
		'RETURN *'
	);
	$res=$qGrn->rObj;
	$arrNode=array(new nodeClass($res[0]['n']->getId(), 
						$res[0]['n']->getProperty('name')));
	$arrLink=array();
	$n1pId=-1; $r1pId=-1;
	$nid=$res[0]['n']->getId();
	
	foreach($res as $row){
	
		$r1id=$row['r1']->getId();
		$n1id=$row['n1']->getId();
		$n2id=$row['n2']->getId();
		$r1t=$row['r1']->getType();
		$r2t=$row['r2']->getType();
		$n1n=$row['n1']->getProperty('name');
		$n2n=$row['n2']->getProperty('name');		
		
		if($n1id!=$n1pId)
			array_push($arrNode, new nodeClass($n1pId=$n1id, $n1n));
			
		if($r1id!=$r1pId){
			$data=new stdClass();
			$data->{'id'}=$row['r1']->getId();
			$data->{'type'}=$row['r1']->getType();
			$relProps=$row['r1']->getProperties();
			foreach($relProps as $key=>$val){				
				if('integer'==gettype($val))
					$data->{$key}=$val;
				else $data->{$key}=$val;
			}
			if('wife'==$r1t || 'husband'==$r1t)
				array_push($arrLink, new linkClass($nid, $n1id, $data));
			else array_push($arrLink, new linkClass($n1id, $nid, $data));
			$r1pId=$r1id;
		}
		
		array_push($arrNode, new nodeClass($n2id, $n2n));
		
		$data=new stdClass();
		$data->{'id'}=$row['r2']->getId();
		$data->{'type'}=$row['r2']->getType();
		$relProps=$row['r2']->getProperties();
		foreach($relProps as $key=>$val){				
			if('integer'==gettype($val))
				$data->{$key}=$val;
			else $data->{$key}=$val;
		}
		if('wife'==$r2t || 'husband'==$r2t)
			array_push($arrLink, new linkClass($n2id, $n1id, $data));
		else array_push($arrLink, new linkClass($n1id, $n2id, $data));
	}
	$nodeJson=json_encode($arrNode);
	$linkJson=json_encode($arrLink);
	echo '{"nodes":'.$nodeJson.',"links":'.$linkJson.'}';	
?>