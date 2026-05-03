// Event types broadcast over WebSocket from the MCP server.
// Must match judgement_mcp/server.py.

export type Speaker = "higuruma" | "judgeman" | "defendant";
export type Ruling = "APPROVE" | "HOLD" | "REJECT" | "REMAND";

export type ScoringRow = {
  criterion: string;
  result: "PASS" | "FAIL";
  evidence: string;
};

export type TrialEvent =
  | { type: "convene"; matter: string }
  | {
      type: "charges";
      summary: string;
      scale: string;
      reversibility: string;
      disposition: string;
    }
  | { type: "round"; number: number; theme: string }
  | {
      type: "speech";
      speaker: Speaker;
      text: string;
      evidence: string | null;
    }
  | { type: "deliberate"; rows: ScoringRow[] }
  | {
      type: "verdict";
      ruling: Ruling;
      reason: string;
      conditions: string[];
      remand: string | null;
    }
  | { type: "adjourn" };
