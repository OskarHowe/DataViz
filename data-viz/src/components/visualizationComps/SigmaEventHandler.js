import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect, useState } from "react";

const TEXT_COLOR = "#FFF";

/**
 * This function draw in the input canvas 2D context a rectangle.
 * It only deals with tracing the path, and does not fill or stroke.
 */
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
/**
 * Custom hover renderer
 */
function drawHover(context, data, settings) {
  const size = settings.labelSize + 6;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  const subLabelSize = 0;

  const label = data.label;
  const subLabel = data.tag !== "unknown" ? data.tag : "";
  const clusterLabel = data.clusterLabel;

  // Then we draw the label background
  context.beginPath();
  context.fillStyle = "#4c4f52";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 8;
  context.shadowColor = "#000";

  context.font = `${weight} ${size}px ${font}`;
  const labelWidth = context.measureText(label).width;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const subLabelWidth = subLabel ? context.measureText(subLabel).width : 0;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const clusterLabelWidth = clusterLabel
    ? context.measureText(clusterLabel).width
    : 0;

  const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth);

  const x = Math.round(data.x);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size / 2 + data.size + 3);
  const hLabel = Math.round(size / 2 + 4);
  const hSubLabel = subLabel ? Math.round(subLabelSize / 2 + 9) : 0;
  const hClusterLabel = clusterLabel ? Math.round(subLabelSize / 2 + 9) : 0;

  drawRoundRect(
    context,
    x,
    y - hSubLabel - 12,
    w,
    hClusterLabel + hLabel + hSubLabel + 15,
    5
  );
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // And finally we draw the labels
  context.fillStyle = TEXT_COLOR;
  context.font = `${weight} ${size}px ${font}`;
  context.fillText(label, data.x + data.size + 3, data.y + size / 2);

  if (subLabel) {
    context.fillStyle = TEXT_COLOR;
    context.font = `${weight} ${subLabelSize}px ${font}`;
    context.fillText(
      subLabel,
      data.x + data.size + 3,
      data.y - (2 * size) / 3 - 2
    );
  }

  if (clusterLabel) {
    context.fillStyle = data.color;
    context.font = `${weight} ${subLabelSize}px ${font}`;
    context.fillText(clusterLabel);
  }
}

const SigmaEventHandler = ({ children, onEntitySelect, onEntityDeselect }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const [selectedNode, setSelectedNode] = useState(null);

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    sigma.setSetting("hoverRenderer", (context, data, settings) =>
      drawHover(
        context,
        { ...sigma.getNodeDisplayData(data.key), ...data },
        settings
      )
    );
    registerEvents({
      clickNode({ node }) {
        if (!graph.getNodeAttribute(node, "hidden")) {
          const origID = parseInt(node.match(/(\d+)/)[0]);
          setSelectedNode(node);
          onEntitySelect(origID);
        }
      },
      clickStage(e) {
        setSelectedNode(null);
        onEntityDeselect();
      },
    });
  }, [sigma, graph]);

  //custom edge layout which is called when a node is selected
  useEffect(() => {
    sigma.setSetting("edgeReducer", (edge, data) => {
      const res = { ...data };

      //if the given edge has no connection to the currently selected node (which is not not) it is hidden
      if (selectedNode && !graph.hasExtremity(edge, selectedNode)) {
        //hide non adjacent edges
        res.hidden = true;
      }
      return res;
    });
  }, [selectedNode]);

  return <>{children}</>;
};

export default SigmaEventHandler;
