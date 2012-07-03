if (typeof smp == "undefined" || !smp) {
  
    var smp = {};
}


smp.namespace = function(sNamespace){
	var parts = sNamespace.split("."),
		parent = smp,
		i;
	
	if(parts[0] === "smp"){
		parts = parts.slice(1);
	}
	
	for(i=0; i<parts.length; i+=1){
		if(typeof parent[parts[i]] === "undefined"){
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

