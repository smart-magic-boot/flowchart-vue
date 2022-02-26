import * as d3 from 'd3';
import {roundTo20} from '../../utils/math';

function render(g, node, isSelected) {
  node.width = node.width || 120;
  node.height = node.height || 60;
  // let borderColor = "#bbbbbb";
  let borderColor = isSelected ? "#666666" : "#bbbbbb";
  let borderWidth = "2px";

  if (node.type === "start" || node.type === "end") {
    let title = g.append("rect").attr("class", "title");
    title
      .style("width", node.width + "px")
      .style("fill", "white")
      .style("stroke-width", borderWidth);

    title
      .attr("x", node.x)
      .attr("y", node.y)
      .classed(node.type, true)
      .attr("rx", 30);
    title.style("height", roundTo20(node.height) + "px");

    title.attr("stroke", borderColor);

  } else if (node.type === "database"){
    let a = 1;
    let title = g.append("ellipse").attr("class", "title");
    title.attr("cx", node.x + node.width / 2);
    title.attr("cy", node.y + node.height / 2);
    title.attr("rx", node.width / 2);
    title.attr("ry", node.height / 2);
    title.style("fill", "white");
    title.style("stroke-width", borderWidth);
    title.classed(node.type, true);
    title.attr("stroke", borderColor);
  } else if (node.type === "operation" || node.type === "dataNode"){
    let titleHeight = "20px";
    g.append("rect")
      .attr("x", node.x)
      .attr("y", node.y)
      .attr("class", "title")
      .style("height", titleHeight)
      .style("fill", "#f1f3f4")

      .attr("stroke", borderColor)
      .style("stroke-width", "2px")

      .style("width", node.width + "px");
    g.append("text")
      .attr("x", node.x + 4)
      .attr("y", node.y + 15)
      .attr("class", "unselectable")
      .text(() => node.name)
      .each(function wrap() {
        let self = d3.select(this),
          textLength = self.node().getComputedTextLength(),
          text = self.text();
        while (textLength > node.width - 2 * 4 && text.length > 0) {
          text = text.slice(0, -1);
          self.text(text + "...");
          textLength = self.node().getComputedTextLength();
        }
      });
    let body = g.append("rect").attr("class", "body");
    body
      .style("width", node.width + "px")
      .style("fill", "white")
      .style("stroke-width", borderWidth);

    body.attr("x", node.x).attr("y", node.y + 20);
    body.style("height", roundTo20(node.height - 20) + "px");

    body.attr("stroke", borderColor);
  } else if (node.type === "msg"){
    let a = 1;
  }

  // body text
  let text = node.value;
  let bodyTextY;
  if (node.type === "start" || node.type === "end") {
    bodyTextY = node.y + 5 + roundTo20(node.height) / 2;
  } else if (node.type === "database"){
    bodyTextY = node.y + 25;
  } else if (node.type === "operation" || node.type === "dataNode"){
    bodyTextY = node.y + 25 + roundTo20(node.height - 20) / 2;
  }
  g.append("text")
    .attr("x", node.x + node.width / 2)
    .attr("y", bodyTextY)
    .attr("class", "unselectable")
    .attr("text-anchor", "middle")
    .text(function () {
      return text;
    })
    .each(function wrap() {
      let self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();
      while (textLength > node.width - 2 * 4 && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + "...");
        textLength = self.node().getComputedTextLength();
      }
    });
}

export default render;