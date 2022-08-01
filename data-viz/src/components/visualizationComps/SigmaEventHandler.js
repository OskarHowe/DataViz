import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect } from "react";

const SigmaEventHandler = ({ children, onEntitySelect, onEntityDeselect }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    registerEvents({
      doubleClickNode({ node }) {
        if (!graph.getNodeAttribute(node, "hidden")) {
          const origID = parseInt(node.match(/(\d+)/)[0]);

          onEntitySelect(origID);
        }
      },
      clickStage(e) {
        onEntityDeselect();
      },
    });
  }, []);

  return <>{children}</>;
};

export default SigmaEventHandler;
