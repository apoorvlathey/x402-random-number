import { paymentMiddleware } from "x402-next";
import { facilitator } from "@coinbase/x402";

/**
 * x402 Payment Middleware Configuration
 *
 * Protects API endpoints and requires payment before access
 * - Uses CDP facilitator for Base mainnet (requires CDP API keys)
 * - Uses default x402.org facilitator for Base Sepolia testnet
 */
export const middleware = paymentMiddleware(
  (process.env.X402_WALLET_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
  {
    // Protect the random number API endpoint
    "/api/random": {
      price: "$0.01", // 0.01 USDC per request
      network:
        (process.env.X402_NETWORK as "base" | "base-sepolia") || "base-sepolia", // base or base-sepolia
      config: {
        description:
          "Random Number Generation Service - Returns a random number within the specified range",
        mimeType: "application/json",
        maxTimeoutSeconds: 60,
        outputSchema: {
          type: "object",
          description: "Generates a random number between min and max values",
          properties: {
            queryParameters: {
              type: "object",
              properties: {
                min: {
                  type: "number",
                  description: "Minimum value for random number (default: 1)",
                  default: 1,
                },
                max: {
                  type: "number",
                  description: "Maximum value for random number (default: 100)",
                  default: 100,
                },
              },
            },
            response: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                randomNumber: { type: "number" },
                range: {
                  type: "object",
                  properties: {
                    min: { type: "number" },
                    max: { type: "number" },
                  },
                },
                timestamp: { type: "string", format: "date-time" },
                cost: { type: "string" },
                network: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  // Use CDP facilitator for mainnet (requires CDP API keys in env)
  // For testnet (base-sepolia), this will automatically use x402.org facilitator
  facilitator
);

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/random/:path*"],
  // Required for @coinbase/x402 facilitator
  runtime: "nodejs",
};
