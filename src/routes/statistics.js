import React from 'react'
import {useD3} from '../common/useD3'
import * as d3 from 'd3';

function Statistics({data}) {
    console.log(data)
    const ref = useD3 (
        (svg) => {
          const height = 400;
          const width = 500;
          const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    
          const x = d3
            .scaleBand()
            .domain(data.map((d) => d.user))
            .rangeRound([margin.left, width - margin.right])
            .padding(0.4);
    
          const y1 = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.count)])
            .rangeRound([height - margin.bottom, margin.top]);
    
          const xAxis = (g) =>
            g.attr("transform", `translate(0,${height - margin.bottom})`).call(
              d3
                .axisBottom(x)
                // .tickValues(
                //   d3
                //     .ticks(...d3.extent(x.domain()), width / 40)
                //     // .filter((v) => x(v) !== undefined)
                // )
                // .tickSizeOuter(10)
            );
    
          const y1Axis = (g) =>
            g
              .attr("transform", `translate(${margin.left},0)`)
              .style("color", "steelblue")
              .call(d3.axisLeft(y1).ticks(null, "s"))
              .call((g) => g.select(".domain").remove())
              .call((g) =>
                g
                  .append("text")
                  .attr("x", -margin.left)
                  .attr("y", 10)
                  .attr("fill", "currentColor")
                  .attr("text-anchor", "start")
                  .text(data.y1)
              );
    
          svg.select(".x-axis").call(xAxis).call(g => g.select('.domain').remove());
          svg.select(".y-axis").call(y1Axis);
    
          svg
            .select(".plot-area")
            .attr("fill", "steelblue")
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.user))
            .attr("width", x.bandwidth())
            .attr("y", (d) => y1(d.count))
            .attr("height", (d) => y1(0) - y1(d.count));
        },
        [data.length]
    );
    
    return (
        <div style={{display:"block",marginLeft:"30vw", textAlign:"center",justifyContent: "center"} }
        >
            <svg
                ref={ref}
                style={{
                    height: "45vw",
                    width: "100%",
                    display: "block",
                    margin: "0 auto"
                }}
            >
                <g className="plot-area" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
        
    );
}

export default Statistics
