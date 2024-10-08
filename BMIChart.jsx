const { useRef, useEffect } = React;
function Chart(){
    const data = [
        { date: 13, y: 10 },
        { date: 14, y: 20 },
        { date: 15, y: 10 },
        { date: 16, y: 60 },
    ];

//chart component
    const LineChart = () => {
        // refs
        const svgRef = useRef();
        const xAxisRef = useRef();
        const yAxisRef = useRef();
        const width = 400;
        const height = 300;

        // draws chart
        useEffect(() => {
            const svg = d3.select(svgRef.current);
            const xAxis = d3.select(xAxisRef.current);
            const yAxis = d3.select(yAxisRef.current);

            // margins and dimensions
            const margin = { top: 20, right: 40, bottom: 50, left: 50 };

            // new data range
            const newDataRange = data.map(d => d.date);

            // scales
            const xScale = d3.scaleLinear()
                .domain([d3.min(newDataRange), d3.max(newDataRange)])
                .range([margin.left, width - margin.right]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.y)])
                .range([height - margin.bottom, margin.top]);

            // axes
            const xAxisGenerator = d3.axisBottom(xScale).ticks(data.length);
            xAxis.call(xAxisGenerator)
                .attr("transform", `translate(0, ${height - margin.bottom})`);

            const yAxisGenerator = d3.axisLeft(yScale);
            yAxis.call(yAxisGenerator)
                .attr("transform", `translate(${margin.left}, 0)`);

            // line generator
            const myLine = d3.line()
                .x((d, i) => xScale(d.date))
                .y((d) => yScale(d.y))
                .curve(d3.curveCardinal);

            // drawing the line
            svg.selectAll(".line")
                .data([data])
                .join("path")
                .attr("class", "line")
                .attr("d", myLine)
                .attr("fill", "none")
                .attr("stroke", "#00bfa6");

            // Add x-axis label
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height - margin.bottom / 3)
                .attr("text-anchor", "middle")
                .attr("fill", "#000")
                .text("Date");

            // Add y-axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", margin.left)
                .attr("x", -(height / 2))
                .attr("dy", "1em")
                .attr("text-anchor", "middle")
                .attr("fill", "#000")
                .text("Value")
                .style("padding-right", "20px"); // Adjust this value as needed

        }, [data]);

        return ReactDOM.createPortal(
            <svg ref={svgRef} width={width} height={height}>
                <g ref={xAxisRef} className="x-axis" />
                <g ref={yAxisRef} className="y-axis" />
            </svg>,
            document.getElementById('dashboard')
        );
    };


    return <LineChart/>;
}

ReactDOM.render(<Chart/>, document.getElementById('root'));