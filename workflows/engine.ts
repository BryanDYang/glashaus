import type { WorkflowNodeName } from "./types";

export const workflowNodeOrder: WorkflowNodeName[] = [
  "concierge",
  "buyer-guidance",
  "seller-guidance",
  "coordination",
  "compliance"
];

export function describeWorkflow() {
  return {
    orchestration: "Workflow-first transaction coordination",
    nodeCount: workflowNodeOrder.length,
    nodes: workflowNodeOrder
  };
}
