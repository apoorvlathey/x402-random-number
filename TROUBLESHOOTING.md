# x402 Troubleshooting Guide

## Debug Endpoints

### 1. Check Configuration
Visit `/api/debug` to see your current x402 configuration (not protected by payment):

```bash
curl http://localhost:3000/api/debug
```

This will show:
- Wallet address
- Network setting
- CDP API key status
- Request headers

### 2. Check Server Logs
When testing payments, watch your terminal/console for detailed logs:

```
🔧 x402 Middleware Configuration:
  Wallet Address: 0xYourAddress
  Network: base
  CDP API Key: SET
  CDP Secret: SET
✅ x402 Middleware loaded successfully

📊 Random API Request:
  Time: 2025-11-02T...
  URL: /api/random?min=1&max=100
  Headers: {...}
  ✅ Payment verified, generating random number: 42
```

## Common Issues on Base Mainnet

### Issue 1: "Internal Server Error" on Base Mainnet

**Symptoms:**
- Works on `base-sepolia` but fails on `base`
- Wallet prompts twice for transfer authorization
- Error: "Payment retry failed: Internal Server Error"

**Possible Causes:**

#### A) Network Configuration Mismatch
Check your `.env.local`:
```env
X402_NETWORK=base  # Must be "base" for mainnet, NOT "base-sepolia"
```

Restart your dev server after changing:
```bash
pnpm dev
```

#### B) Insufficient Mainnet USDC
- **Base Sepolia**: Uses testnet USDC (free from faucets)
- **Base Mainnet**: Requires real USDC

Check your wallet has at least 0.01 USDC on Base mainnet.

#### C) Insufficient ETH for Gas
Even though the x402 facilitator is fee-free, you still need ETH for gas on Base mainnet:
- Need ~0.0001 ETH for transaction gas
- Base Sepolia gas is free; Base mainnet requires real ETH

**Get Base ETH:**
- Bridge from Ethereum L1
- Use Coinbase or another exchange that supports Base

#### D) USDC Contract Differences
Verify you're using the correct USDC contract:
- **Base Mainnet USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Base Sepolia USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

The x402-next package should handle this automatically, but double-check in your wallet.

### Issue 2: Double Wallet Prompts

**Symptoms:**
- Wallet asks for signature twice
- Still fails after both signatures

**Possible Causes:**

#### A) Retry Logic
x402 has built-in retry logic. If the first attempt fails, it retries automatically. This is normal behavior.

#### B) Transaction Failing On-Chain
Check Base block explorer:
1. Go to https://basescan.org
2. Search for your wallet address
3. Look for failed transactions
4. Check the error message

Common on-chain errors:
- "Insufficient balance" - Need more USDC or ETH
- "Signature expired" - Transaction took too long
- "Nonce too high" - Wallet state issue (reset wallet)

### Issue 3: Payment Verification Fails

**Debug Steps:**

1. **Check middleware logs** (should see on server start):
```
🔧 x402 Middleware Configuration:
  Wallet Address: 0x... (should be YOUR address, not 0x000...)
  Network: base (should match what you want)
```

2. **Check API request logs** (should see on each request):
```
📊 Random API Request:
  Time: ...
  URL: ...
  Headers: ...
```

3. **If you see an error**, it will show:
```
❌ Error in Random API:
  Error: [detailed error message]
  Stack: [stack trace]
```

4. **Check the x402 facilitator is accessible**:
```bash
# The facilitator endpoint (used internally by x402-next)
curl https://facilitator.x402.org/health
```

### Issue 4: Wrong Network in Wallet

**Symptoms:**
- Wallet shows wrong network
- Transaction fails with "network mismatch"

**Solution:**
Make sure your wallet is connected to:
- **Base Mainnet** (Chain ID: 8453) when using `X402_NETWORK=base`
- **Base Sepolia** (Chain ID: 84532) when using `X402_NETWORK=base-sepolia`

## Environment Variables Checklist

```env
# Required
X402_WALLET_ADDRESS=0xYourActualWalletAddress  # NOT the default 0x000...

# Required - must match your intended network
X402_NETWORK=base  # or "base-sepolia" for testnet

# Optional (for Coinbase Onramp integration)
CDP_API_KEY_ID=your_key_id
CDP_API_KEY_SECRET=your_secret
```

## Testing Workflow

### 1. Test on Base Sepolia First
```env
X402_NETWORK=base-sepolia
```
- Get testnet USDC from faucet
- Gas is free
- Test everything works

### 2. Switch to Base Mainnet
```env
X402_NETWORK=base
```
- Ensure you have real USDC (at least 0.01)
- Ensure you have ETH for gas (at least 0.001)
- Test with small amounts first

## Still Having Issues?

1. **Check server logs carefully** - look for the debug output added
2. **Visit `/api/debug`** to verify configuration
3. **Check Base block explorer** for transaction details
4. **Try base-sepolia first** to isolate network issues
5. **Open browser console** (F12) to see client-side errors
6. **Join x402 Discord**: https://discord.gg/cdp

## Useful Resources

- [x402 Documentation](https://x402.gitbook.io/x402)
- [x402-next Package](https://github.com/coinbase/x402/tree/main/typescript/packages/x402-next)
- [Base Network Docs](https://docs.base.org)
- [Base Block Explorer](https://basescan.org)
- [Base Sepolia Explorer](https://sepolia.basescan.org)

