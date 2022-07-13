import { SocialDistance } from "@mui/icons-material";

const nodeStyle = {
  selector: "node",
  style: {
    color: "#fff",
    "background-color": "#ffb039",
    "background-opacity": 0.2,
    // "border-style": solid,
    "border-width": 3,
    "border-color": "#ffb039",
    "border-opacity": 0.85,
    width: 40,
    height: 40,
    label: "data(label)",
  },
};

const edgeStyle = {
  selector: "edge",
  style: {
    width: 6,
    opacity: 0.3, // The opacity of edges
    "target-arrow-shape": "triangle",
    "curve-style": "bezier",
  },
};

export { nodeStyle, edgeStyle };
