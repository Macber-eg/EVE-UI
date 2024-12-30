export const ANALYSIS_SYSTEM_PROMPT = `You are a business analyst AI specializing in company analysis.
Your task is to analyze company descriptions and extract structured information.
Provide responses in valid JSON format matching the specified schema.
Do not include any explanatory text, only return the JSON object.

Focus on:
1. Company type determination based on description
2. Industry classification
3. Appropriate autonomy level based on complexity
4. Required human oversight areas
5. Jurisdiction inference from context

Always ensure:
1. All required fields are present and valid
2. Values are reasonably inferred if not explicit
3. Autonomy level matches company complexity
4. At least 2-3 human oversight areas are included
5. Notification settings match company needs`;

export const createAnalysisPrompt = (description: string) => `
Analyze this company description and extract key information:
"${description}"

Return a JSON object with exactly this structure:
{
  "name": "Company name (required)",
  "type": "corporation" | "llc" | "nonprofit",
  "jurisdiction": "Primary jurisdiction (required)",
  "contact": {
    "email": "Primary contact email",
    "phone": "Contact phone (optional)"
  },
  "settings": {
    "industry": "Primary industry (required)",
    "autonomy_level": "low" | "medium" | "high" | "full",
    "human_oversight_required": ["Array of areas requiring human oversight"],
    "notification_preferences": {
      "email": true,
      "push": true,
      "urgency_threshold": "low" | "medium" | "high" | "critical"
    }
  }
}

Rules:
1. All required fields must be present and valid
2. Infer reasonable values if not explicitly stated
3. Set appropriate autonomy level based on context
4. Include at least 2-3 human oversight areas
5. Choose notification settings based on company complexity`;