<?php

	require("phar://neo4jphp.phar");

	class CQuery{
		var $qStr; // cypher query string
		var $qObj; // query object returned by Neo4jphp library
		var $rObj; // objectect returned after execution of the query
		private static $client;
		function __construct($qStr){
			$this->qStr=$qStr;
			$this->qObj=new Everyman\Neo4j\Cypher\Query(self::$client, $qStr);
			$this->rObj=$this->qObj->getResultSet();
		}
		static function init(){self::$client=new Everyman\Neo4j\Client();}
		static function client(){return self::$client;}
	}

	function CQuery($qStr){return new CQuery($qStr);}
	
	CQuery::init();

?>