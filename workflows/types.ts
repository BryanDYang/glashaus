export type WorkflowNodeName =
  | "concierge"
  | "buyer-guidance"
  | "seller-guidance"
  | "coordination"
  | "compliance";

export type DealSide = "buyer" | "seller";

export type DealState = {
  dealId: string;
  side: DealSide;
  currentStep: string;
  notes: string[];
};
