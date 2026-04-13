export const workflowStages = [
  { label: "State model", value: "Deals, milestones, and documents persist in structured records." },
  { label: "Workflow engine", value: "LangGraph nodes route work through deterministic steps." },
  { label: "Document boundary", value: "Storage access stays restricted and auditable." }
];

export const capabilities = [
  {
    title: "Buyer intake",
    description: "Collect the minimum data needed to guide buyers through the next step in the transaction path."
  },
  {
    title: "Seller prep",
    description: "Track listing readiness, task completion, and handoff points before a property goes live."
  },
  {
    title: "Shared milestones",
    description: "Keep the deal timeline visible so every participant can see what is done, due, and blocked."
  },
  {
    title: "Document workspace",
    description: "Store transaction files with a strict authorization boundary around raw document access."
  }
];
