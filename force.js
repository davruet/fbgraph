/** ForceGraph - by David Rueter, adapted from an example at https://github.com/mbostock/d3
*/

function ForceGraph(graphData){
	this.graphData = graphData;
	this.imgSize = 2.5;
	
	graphObj = this;
	
	this.rebuild = function (){
		  this.link = this.vis.selectAll("line.link")
		  .data(this.graphData.links)
		.enter().insert("svg:line", ".node")
		  .attr("class", "link")
		  .style("stroke-width", function(d) { return Math.sqrt(d.value); })
		  .attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });
		  //.style("marker-end", "url(#Triangle)");
	
		group = this.vis.selectAll("g.node")
		  .data(this.graphData.nodes)
		.enter().append("svg:g")
		  .attr("class", "node")
		  .attr("id", function(d) { return "nodeid:" + d.index; })
		   .call(this.force.drag)
		   .on("mouseover", this.showdetail)
		   .on("mouseout", this.hidedetail)
		   .attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
		   });
		   
		clipPath = function(d){return "url(#clippath" + d.index + ")"};
		
		group.append("svg:rect")
			  .attr("x", -25)
			  .attr("y", -25)
			  .attr("width", 50)
			  .attr("height", 50)
			  .attr("clip-path", clipPath)
			  //.attr("fill", "#fff")
			  .attr("class", "chromeworkaround");	  
			  
		group.append("svg:defs").append("svg:clipPath")
			.attr("id", function(d){return "clippath" + d.index})
			.append("svg:circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("clipPathUnits", "objectBoundingBox")
			.attr("r", this.imgSize);			
				
		group.append("svg:image")
			.attr("x", -25)
			.attr("y", -25)
			.attr("width", "50")
			.attr("height", "50")
			.attr("xlink:href", function(d){return d.image;})
			.attr("clip-path", clipPath);
		  
		group.append("svg:title")
				.text(function(d) { return d.name; });
		this.force.start();
	}	
	
	this.hidedetail = function(g, i){
		group = d3.select(this);
		group.selectAll("defs circle").transition().attr("r", graphObj.imgSize);
	}
				
	this.showdetail = function(d, i){		
		group = d3.select(this);
		group.selectAll("defs circle").transition().attr("r", "25");
	}
	
	this.update = function (){
		if (!this.initialized){
			this.vis = d3.select("#chart")
				.append("svg:svg")
					.attr("width", document.body.clientWidth)
					.attr("height", 900)
					.attr("zoomAndPan", "magnify");	
		
			this.force = d3.layout.force()
			  .charge(-70)
			  .linkDistance(40)
			  .friction(.5)
			  .theta(.3)
			  .nodes(this.graphData.nodes)
			  .links(this.graphData.links)
			  .size([document.body.clientWidth, document.body.clientHeight])
			  .start();
				  
		  	this.vis.style("opacity", 1e-6)
			.transition()
			  .duration(2000)
			  .style("opacity", 1);
		    forceGraph = this;
		  	this.force.on("tick", function() {
		 		forceGraph.vis.selectAll("line.link")
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
			
				forceGraph.vis.selectAll("g.node")
					.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
	
		  });
		  this.initialized = true;
		} 
		
		this.rebuild();
		
	}
	
	this.setSize = function(w,h){
		if (this.initialized){
			this.force.size([w,h]);
			this.vis.attr("width", w).attr("height", h);
		}
	}
	
}





