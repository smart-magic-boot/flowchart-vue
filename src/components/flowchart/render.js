import * as d3 from 'd3';
import {roundTo20} from '../../utils/math';

function render(g, node, isSelected) {
  //console.log("isSelected: "+isSelected+", render:"+JSON.stringify(node));
  node.width = node.width || 120;
  node.height = node.height || 60;

  if (node.type === "start"){
    renderStart(g, node, isSelected);
  } else if (node.type === "end") {
    renderEnd(g, node, isSelected);
  } else if (node.type === "operation") {
    renderOperation(g, node, isSelected);
  }  else if (node.type === "dataNode") {
    renderDataNode(g, node, isSelected);
  } else if (node.type === "msg") {
    renderMsg(g, node, isSelected);
  } else if (node.type === "database") {
    renderDatabase(g, node, isSelected);
  }
  renderBodyText(g, node, isSelected);
}

function renderBodyText (g, node, isSelected) {
  // body text
  let text = node.value;
  let bodyTextY;
  if (node.type !== "start" && node.type !== "end") {
    if (node.type === "database") {
      bodyTextY = node.y + node.height / 2 + 5;//25;
    } else {
      bodyTextY = node.y + 25 + roundTo20(node.height - 20) / 2;
    }
  } else {
    bodyTextY = node.y + 5 + roundTo20(node.height) / 2;
  }
  g.append("text")
    .attr("x", node.x + node.width / 2)
    .attr("y", bodyTextY)
    .attr("class", "bodyText unselectable")
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
function renderStart (g, node, isSelected) {

  let body = g.append("rect").attr("class", "body");
  body
    .style("width", node.width + "px")
    .style("stroke-width", node.borderWidth);

  body
    .attr("x", node.x)
    .attr("y", node.y)
    .classed(node.type, true)
    .attr("rx", 30);
  body.style("height", roundTo20(node.height) + "px");

}
function renderEnd (g, node, isSelected) {
  let body = g.append("rect").attr("class", "body");
  body
    .style("width", node.width + "px")
    .style("stroke-width", node.borderWidth);

  body
    .attr("x", node.x)
    .attr("y", node.y)
    .classed(node.type, true)
    .attr("rx", 30);
  body.style("height", roundTo20(node.height) + "px");
}
function renderDataNode (g, node, isSelected) {
  g.append("rect")
    .attr("x", node.x)
    .attr("y", node.y)
    .attr("class", "title")
    .style("height", node.height)
    .style("stroke-width", node.borderWidth)
    .style("width", node.width + "px");
  g.append("text")
    .attr("x", node.x + 4)
    .attr("y", node.y + 15)
    .attr("class", "titleText unselectable")
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
    .style("stroke-width", node.borderWidth);

  body.attr("x", node.x).attr("y", node.y + 20);
  body.style("height", roundTo20(node.height - 20) + "px");

}
function renderMsg (g, node, isSelected) {

  if(!node.offset){
    node.offset = 15;
  }

  let bx1 = node.x;
  let by1 = node.y + node.height;
  let bx2 = bx1 + node.width;
  let by2 = by1;
  let bx3 = bx2 + ((node.offset/node.height)*(node.height - 20));
  let by3 = by2 - (node.height - 20);
  let bx4 = bx3 - node.width;
  let by4 = by3;
  let bpoints = bx1 + "," + by1 + " " + bx2 + "," + by2 + " " + bx3 + "," + by3 + " " + bx4 + "," + by4

  let tx1 = bx4;
  let ty1 = by4;
  let tx2 = bx3;
  let ty2 = by3;
  let tx3 = bx2 + node.offset;
  let ty3 = ty2 - 20;
  let tx4 = bx1 + node.offset;
  let ty4 = ty3;
  let tpoints = tx1 + "," + ty1 + " " + tx2 + "," + ty2 + " " + tx3 + "," + ty3 + " " + tx4 + "," + ty4

  g.append("polygon")
    .attr("points", tpoints)
    .attr("class", "title")
    .style("stroke-width", node.borderWidth);

  g.append("text")
    .attr("x", node.x + node.offset)
    .attr("y", node.y + 15)
    .attr("class", "titleText unselectable")

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

  g.append("polygon")
    .attr("points", bpoints)
    .attr("class", "body")
    .style("stroke-width", node.borderWidth);

}
function renderDatabase (g, node, isSelected) {
  let body = g.append("ellipse").attr("class", "body");
  body.attr("cx", node.x + node.width / 2);
  body.attr("cy", node.y + node.height / 2);
  body.attr("rx", node.width / 2);
  body.attr("ry", node.height / 2);
  body.style("stroke-width", node.borderWidth);
  body.classed(node.type, true);
}
function renderOperation (g, node, isSelected) {
  let borderColor = isSelected ? "#000000" : "#bbbbbb";
  if (node.type !== "start" && node.type !== "end") {
    // title
    if (node.id !== 3) {
      g.append("rect")
        .attr("x", node.x)
        .attr("y", node.y)
        .attr("stroke", borderColor)
        .attr("class", "title")
        .style("height", "20px")
        .style("fill", "#f1f3f4")
        .style("stroke-width", "1px")
        .style("width", node.width + "px");
      g.append("text")
        .attr("x", node.x + 4)
        .attr("y", node.y + 15)
        .attr("class", "titleText unselectable")
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
    }
  }
  // body
  if (node.id === 3) {
    let body = g.append("ellipse").attr("class", "body");
    body.attr("cx", node.x + node.width / 2);
    body.attr("cy", node.y + node.height / 2);
    body.attr("rx", node.width / 2);
    body.attr("ry", node.height / 2);
    body.style("fill", "white");
    body.style("stroke-width", "1px");
    body.classed(node.type, true);
    body.attr("stroke", borderColor);
  } else {
    let body = g.append("rect").attr("class", "body");
    body
      .style("width", node.width + "px")
      .style("fill", "white")
      .style("stroke-width", "1px");
    if (node.type !== "start" && node.type !== "end") {
      body.attr("x", node.x).attr("y", node.y + 20);
      body.style("height", roundTo20(node.height - 20) + "px");
    } else {
      body
        .attr("x", node.x)
        .attr("y", node.y)
        .classed(node.type, true)
        .attr("rx", 30);
      body.style("height", roundTo20(node.height) + "px");
    }
    body.attr("stroke", borderColor);
  }
}

export default render;