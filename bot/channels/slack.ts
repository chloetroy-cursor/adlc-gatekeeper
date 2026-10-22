import { slackChannel } from "@cursor/bdk/channels/slack";

/**
 * Slack channel (Socket Mode).
 *
 * Tokens: ADLC_GATEKEEPER_SLACK_BOT_TOKEN + ADLC_GATEKEEPER_SLACK_APP_TOKEN
 *
 * Full setup: bdk slack create --dir .
 */
export default slackChannel({
  envPrefix: "ADLC_GATEKEEPER",
  // Streaming and thinking steps default to true.
  suggestedPrompts: [
    { title: "Help", message: "How can you help me?" },
    { title: "Status", message: "What are you working on?" },
  ],
});
