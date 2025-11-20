(function(){
 const data = {
 nodes: [
 { id: "Me", label: "Me", proficiency: 1, workAmount: 10 },
 { id: "Robotics Teacher", label: "Robotics Teacher", proficiency: 0.9, workAmount: 8 },
 { id: "Media Producer", label: "Media Producer", proficiency: 0.8, workAmount: 6 },
 { id: "Mobile App Sales", label: "Mobile App Sales", proficiency: 0.5, workAmount: 4 },
 { id: "Project Manager", label: "Project Manager", proficiency: 0.4, workAmount: 3 },
 { id: "Data Analyst", label: "Data Analyst", proficiency: 0.3, workAmount: 2 }
 ],
 links: [
 { source: "Me", target: "Robotics Teacher", value: 0.9 },
 { source: "Me", target: "Media Producer", value: 0.8 },
 { source: "Me", target: "Mobile App Sales", value: 0.5 },
 { source: "Me", target: "Project Manager", value: 0.4 },
 { source: "Me", target: "Data Analyst", value: 0.3 }
 ]
 };


 // Set up the dimensions and margins of the graph
 const width = 800;
 const height = 600;


 // Create an SVG container inside the section
 const svg = d3.select("#vis-node-link")
 .append("svg")
 .attr("width", width)
 .attr("height", height);


 // Define the center of the chart
 const centerX = width / 2;
 const centerY = height / 2;


 // Create a force simulation
 const simulation = d3.forceSimulation(data.nodes)
 .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => {
 // Adjust distance based on proficiency (higher proficiency = closer to center)
 const baseDistance = 100;
 return baseDistance / d.target.proficiency;
 }))
 .force("charge", d3.forceManyBody().strength(-200))
 .force("center", d3.forceCenter(centerX, centerY))
 .force("radial", d3.forceRadial(centerX, centerY, Math.min(width, height) / 2 - 50).strength(d => d.id === "Me" ? 0.7 : d.proficiency * 0.1)); // Radial force


 // Create links
 const link = svg.append("g")
 .attr("class", "links")
 .selectAll("line")
 .data(data.links)
 .enter().append("line")
 .attr("class", "link")
 .style("stroke-width", d => d.value * 5); // Adjust link thickness based on value


 // Create nodes
 const node = svg.append("g")
 .attr("class", "nodes")
 .selectAll("g")
 .data(data.nodes)
 .enter().append("g");


 // Append circles behind the text
 node.append("circle")
 .attr("r", d => d.workAmount * 1.5) // Scale the radius based on workAmount
 .attr("fill", d => d.id === "Me" ? "red" : "lightgray"); // Background color for the circle


 node.append("text")
 .text(d => d.label);


 // Update positions of nodes and links on every tick of the simulation
 simulation.on("tick", () => {
 link
 .attr("x1", d => d.source.x)
 .attr("y1", d => d.source.y)
 .attr("x2", d => d.target.x)
 .attr("y2", d => d.target.y);

 node
 .attr("transform", d => `translate(${d.x},${d.y})`);
 });
})();