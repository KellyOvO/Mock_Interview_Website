(function(){
       const data1 = [
            { axis: "Honesty", value: 1 },
            { axis: "Executive Force", value: 1 },
            { axis: "Creativity", value: 0.9 },
            { axis: "Communication", value: 1 },
            { axis: "Problem Solving", value: 0.95 },
            { axis: "Teamwork", value: 0.7 }
        ];

        console.log("Data:", data1); // ADDED: Check the data

        // Configuration
        const width1 = 800;
        const height1 = 600;
        const margin1 = { top: 50, right: 50, bottom: 50, left: 50 };
        const radius = Math.min(width1, height1) / 2 - 50;

        console.log("Radius:", radius); // ADDED: Check the radius

        const numAxes = data1.length;

        // Create SVG
        const svg1 = d3.select("#vis-radar")
            .append("svg")
            .attr("width", width1)
            .attr("height", height1)
            .append("g")
            .attr("transform", `translate(${width1 / 2},${height1 / 2})`);

        // Scale
        const angleSlice = Math.PI * 2 / numAxes;
        const maxValue = d3.max(data1, d => d.value);
        const rScale = d3.scaleLinear()
            .domain([0, maxValue]) // Assuming values are between 0 and 1
            .range([0, radius]);

        console.log("rScale(1):", rScale(1)); // ADDED: Check the scale output

        // Draw grid circles
        const numGridCircles = 5;
        for (let i = 1; i <= numGridCircles; i++) {
            const circleRadius = radius / numGridCircles * i;
            console.log("Grid Circle Radius:", circleRadius); // ADDED: Check the radius
            svg1.append("circle")
                .attr("class", "gridCircle")
                .attr("r", circleRadius);
        }

        // Create radial lines (axes)
        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleSlice - Math.PI / 2; // Adjust starting angle
            svg1.append("line")
                .attr("class", "axis")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", rScale(1) * Math.cos(angle))
                .attr("y2", rScale(1) * Math.sin(angle));

            // Add axis labels
            svg1.append("text")
                .attr("class", "axisLabel")
                .attr("x", (rScale(1.1) * Math.cos(angle))) // Position the labels slightly outside the radar
                .attr("y", (rScale(1.1) * Math.sin(angle)))
                .attr("dy", "0.35em") // Vertically center the text
                .style("text-anchor", "middle") // Horizontally center the text
                .text(data1[i].axis);
        }

        // Function to convert data points to coordinates
        function radarLine(data1) {
            const coords = data1.map((d, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                return [rScale(d.value) * Math.cos(angle), rScale(d.value) * Math.sin(angle)];
            });
            return d3.line()(coords);
        }

        // Draw the radar area
        svg1.append("path")
            .attr("class", "radarStroke")
            .attr("d", radarLine(data1))
            .style("fill", "rgba(107, 76, 154, 0.2)") // Ensure fill is applied
            .style("stroke", "#6b4c9a");

        // Draw the dots
        svg1.selectAll(".radarDot")
            .data(data1)
            .enter().append("circle")
            .attr("class", "radarDot")
            .attr("cx", (d, i) => rScale(d.value) * Math.cos(i * angleSlice - Math.PI / 2))
            .attr("cy", (d, i) => rScale(d.value) * Math.sin(i * angleSlice - Math.PI / 2))
            .attr("r", 5)
            .style("fill", "#6b4c9a");
})();