/*
    Simple JavaScript grid with pagination and custom CSS.
    Browsers support:
    IE 9.0 +
    Firefox 3.0 +
    Chrome 4.0 +
    Safari 3.2 +
    Opera 9.5 +
    
    by Pavel Savinov // http://www.pavelsavinov.info
    
*/
PSGrid = function () {};
PSGrid = function (options) {
	this.opts = options;
};

PSGrid.prototype.getOptions = function (){
	return this.opts;
};

PSGrid.prototype.render = function (target) {
	var page = parseInt(document.getElementById(target).getAttribute("page"));
	var rowsCount = !this.opts.rowsCount ? 10 : this.opts.rowsCount;
	if (isNaN(page)){
		page = 0;
	}
	var grid = this;
	if (!this.opts.select){
	    this.opts.select = function(row){};
	}
	var se = this.opts.select;
	var d = this.opts.data;
	document.getElementById(target).select = function (){
		var r = parseInt(document.getElementById(target).getAttribute("selectedRow"));
		se(d[r]);
	};
	document.getElementById(target).prev_page = function () {
		var pn = parseInt(document.getElementById(target).getAttribute("page"));
		if (isNaN(pn)){
			pn = 0;
		}		
		if (pn>0) pn--;
		document.getElementById(target).setAttribute("page",pn);
		grid.render(target);
	};
	document.getElementById(target).next_page = function () {
		var pn = parseInt(document.getElementById(target).getAttribute("page"));
		if (isNaN(pn)){
			pn = 0;
		}		
		if ((pn+1)*rowsCount<grid.opts.data.length) pn++;
		document.getElementById(target).setAttribute("page",pn);
		grid.render(target);
	};
	document.getElementById(target).setAttribute("page",page);
	var tableOpen = "<table class='grid' style='width: "+this.opts.width+"'>";
	tableOpen += "<tr>";
	for (var k=0;k<this.opts.columns.length;k++) {
		tableOpen += "<td class='headerRow'";
		if (this.opts.columns[k].width) {
			tableOpen += " style='width: "+this.opts.columns[k].width+"'";
		}
		tableOpen += ">"+this.opts.columns[k].label;
		tableOpen += "</td>";
	}
	tableOpen += "</tr>";
	var endCnt = (page+1)*rowsCount < this.opts.data.length ? (page+1)*rowsCount : this.opts.data.length;
	for (var k=page*rowsCount;k<endCnt; k++) {
		var item = this.opts.data[k];
		tableOpen += "<tr>";
		for (var q=0;q<this.opts.columns.length;q++) {
			var align = this.opts.columns[q].align;
			if (!align) {
				align = "center";
			}
			tableOpen += "<td class='gridRow awad-grid-row-"+k+"' onclick='selectRow("+k+",\""+target+"\");' style='text-align: "+align+";'>";
			tableOpen += item[this.opts.columns[q].key];
			tableOpen += "</td>";
		}		
		tableOpen += "</tr>";
	}
	tableOpen += "<tr>";
	tableOpen += "<td class='summaryRow' colspan='"+this.opts.columns.length+"'>";
	tableOpen += "<div style='position:relative; width: 100%;'>&nbsp;Total found: <b>"+this.opts.data.length+"</b>";
	tableOpen += "<div style='position:absolute; right:5; top:-7;'><span class='pageSwitch' onclick='prev_page(\""+target+"\");'>&larr;</span>&nbsp;";
	tableOpen += "<span>"+(page*rowsCount+1)+" - "+endCnt+"</span>&nbsp;<span class='pageSwitch' onclick='next_page(\""+target+"\");'>&rarr;</span>";
	tableOpen += "</div></div></td>";
	tableOpen += "</tr>";
	tableOpen += "</table>";
	document.getElementById(target).setAttribute("selectedRow","");
	this.opts.target=target;
	document.getElementById(target).innerHTML = tableOpen;
	
};

next_page = function (target) {
	document.getElementById(target).next_page();
};

prev_page = function (target) {
	document.getElementById(target).prev_page();
};

removeClass = function(obj, cls) {
  var classes = obj.className.split(' ');
  for(i=classes.length-1; i>=0; i--) {
    if (classes[i] == cls) {
      classes.splice(i, 1);
      i--; 
    }
  }
  obj.className = classes.join(' ');   
};

selectRow = function (row,target) {
    var elems = document.getElementsByClassName("gridRow selectedRow");
    for (var i=elems.length-1;i>=0;i--){
        removeClass(elems[i],"selectedRow");
    }
    var elems = document.getElementsByClassName("awad-grid-row-"+row);
    for (var i=elems.length-1;i>=0;i--){
        var e = elems[i];
        var s = "";
        if (e.className) {
            s = e.className;
        }
        s += " selectedRow";
        e.className = s;
    }    
	document.getElementById(target).setAttribute("selectedRow",row);
	document.getElementById(target).select();

};
