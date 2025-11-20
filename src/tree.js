(function() {
        const initialTreeData = {
            "name": "Hobbies",
            "children": [
                {
                    "name": "Art",
                    "children": [
                        {"name": "Painting"},
                        {"name": "Drawing"},
                        {"name": "Sculpting"}
                    ]
                },
                {
                    "name": "Music",
                    "children": [
                        {"name": "Playing Yangqin"},
                        {"name": "Singing"},
                        {"name": "Listening to Music"}
                    ]
                },
                {
                    "name": "Sports",
                    "children": [
                        {"name": "Billiards"},
                        {"name": "Swimming"},
                        {"name": "Running"}
                    ]
                }
            ]
        };

        // Set the dimensions and margins of the diagram
        const margin = {top: 20, right: 200, bottom: 30, left: 130},
            width = 660 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#vis-tree").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // declares a tree layout and assigns the size
        const treemap = d3.tree().size([height, width]);

        let animationInterval = null; // Store the interval ID

        function update(source) {
            // Assigns the data to a hierarchy using parent-child relationships
            let nodes = d3.hierarchy(source, function(d) {
                return d.children;
            });

            // Maps the node data to the tree layout
            nodes = treemap(nodes);

            // Select all existing nodes and update with the new data
            const node = svg.selectAll(".node")
                .data(nodes.descendants(), d => d.data.name);

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")");

            // Add Circle for the nodes
            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", "#fff");

            // Add labels for the nodes
            nodeEnter.append("text")
                .attr("dy", ".35em")
                .attr("x", d => d.children ? -13 : 13)
                .attr("text-anchor", d => d.children ? "end" : "start")
                .text(d => d.data.name);

            // UPDATE
            const nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(750)
                .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

            // Update the node attributes and style
            nodeUpdate.select('circle')
                .attr('r', 5)
                .style("fill", "#fff");

            // Remove any exiting nodes
            const nodeExit = node.exit().transition()
                .duration(750)
                .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // Store the old positions for transition.
            nodes.descendants().forEach(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Update the links
            const link = svg.selectAll(".link")
                .data(nodes.descendants().slice(1), d => d.data.name);

            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().insert("path", "g")
                .attr("class", "link")
                .attr('d', d => {
                    const o = {x: source.x0, y: source.y0};
                    return diagonal(o, o)
                });

            // UPDATE
            const linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(750)
                .attr('d', d => diagonal(d, d.parent));

            // Remove any exiting links
            link.exit().transition()
                .duration(750)
                .attr('d', d => {
                    const o = {x: source.x, y: source.y};
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.descendants().forEach(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            return `M${s.y},${s.x}C${(s.y + d.y) / 2},${s.x} ${(s.y + d.y) / 2},${d.x} ${d.y},${d.x}`;
        }

        // Initial data
        initialTreeData.x0 = height / 2;
        initialTreeData.y0 = 0;

        // Call update with the initial data
        update(initialTreeData);

        // Animation function
        function animate() {
            // Create a shuffled copy of the children arrays
            const shuffledTreeData = structuredClone(initialTreeData); // Use structuredClone for deep copy
            shuffleChildren(shuffledTreeData);

            // Update the tree with the shuffled data
            update(shuffledTreeData);
        }

        // Recursive function to shuffle children arrays
        function shuffleChildren(node) {
            if (node.children) {
                shuffleArray(node.children);
                node.children.forEach(child => shuffleChildren(child));
            }
        }

        // Fisher-Yates shuffle algorithm
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
        }

        // Function to toggle animation
        function toggleAnimation() {
            const animateCheckbox = document.getElementById("animateCheckbox");
            if (animateCheckbox.checked) {
                // Start animation
                if (!animationInterval) {
                    animationInterval = setInterval(animate, 2000);
                }
            } else {
                // Stop animation
                if (animationInterval) {
                    clearInterval(animationInterval);
                    animationInterval = null;

                    // Restore the initial tree structure
                    update(initialTreeData); // Redraw with the original data
                }
            }
        }

        // Attach event listener to the checkbox
        const animateCheckbox = document.getElementById("animateCheckbox");
        animateCheckbox.addEventListener("change", toggleAnimation);

        // Initially, the animation is off, so draw the initial tree
        update(initialTreeData);
    })();