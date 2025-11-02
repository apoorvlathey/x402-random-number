# Setting Up CDP API Keys for Base Mainnet

## Why Do You Need CDP API Keys?

According to the [x402 documentation](https://x402.gitbook.io/x402/llms-full.txt), the **default x402.org facilitator ONLY supports**:

- ✅ Base Sepolia (testnet)
- ✅ Solana Devnet (testnet)
- ❌ **NOT Base mainnet**

**For Base mainnet production use**, you need to use the **CDP (Coinbase Developer Platform) facilitator**, which requires API keys.

## Getting CDP API Keys (Free)

### Step 1: Create a CDP Account

1. Go to [CDP Portal](https://portal.cdp.coinbase.com/)
2. Sign in or create a new account (free)

### Step 2: Create API Keys

1. Navigate to [API Keys](https://portal.cdp.coinbase.com/projects/api-keys)
2. Click **"Create API key"**
3. Choose **"Secret API Key"** (not Client API Key)
4. Download and securely store your API key file

You'll get:

- `CDP_API_KEY_ID` - Your API key ID
- `CDP_API_KEY_SECRET` - Your API key secret (keep this safe!)

### Step 3: Add to Environment Variables

Update your `.env.local` file:

```env
# Required for Base mainnet
X402_WALLET_ADDRESS=0xYourWalletAddress
X402_NETWORK=base

# CDP API Keys (required for Base mainnet)
CDP_API_KEY_ID=your_api_key_id_here
CDP_API_KEY_SECRET=your_api_key_secret_here
```

### Step 4: Restart Your Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

You should now see in the logs:

```
🔧 x402 Middleware Configuration:
  Wallet Address: 0xf90e6125C8918F1ADAc31f85D80728dB62F17d9B
  Network: base
  CDP API Key: SET  ✅
  CDP Secret: SET   ✅
  Facilitator: CDP Facilitator (recommended for production)  ✅
✅ x402 Middleware loaded successfully
```

## Testing on Base Mainnet

Once you have CDP API keys set up:

1. **Make sure you have real USDC** on Base mainnet
2. **Have ETH for gas** (even though facilitator is fee-free, you need gas)
3. Test the API endpoint

Your Base mainnet payments should now work! 🎉

## Still Using Base Sepolia (Testnet)?

If you're just testing and want to use Base Sepolia:

```env
# Testnet configuration (no CDP keys needed)
X402_WALLET_ADDRESS=0xYourWalletAddress
X402_NETWORK=base-sepolia

# CDP keys NOT required for testnet
# CDP_API_KEY_ID=
# CDP_API_KEY_SECRET=
```

The default x402.org facilitator works perfectly for Base Sepolia.

## Alternative: Community Facilitators

If you **really** can't get CDP API keys, the middleware will fallback to the **PayAI community facilitator** for Base mainnet, but this is **NOT recommended for production** because:

- ❌ Not officially supported by Coinbase
- ❌ May have reliability issues
- ❌ No SLA or guarantees
- ❌ Could go offline

**For production Base mainnet apps, always use CDP facilitator with API keys.**

## Security Best Practices

1. ✅ **Never commit** `.env.local` or API keys to git
2. ✅ **Keep API secrets safe** - treat them like passwords
3. ✅ **Use environment variables** in production (Vercel, Railway, etc.)
4. ✅ **Rotate keys periodically** for security
5. ✅ **Test on Base Sepolia** before going to mainnet

## Resources

- [CDP Portal](https://portal.cdp.coinbase.com/)
- [CDP Documentation](https://docs.cdp.coinbase.com/)
- [x402 Documentation](https://x402.gitbook.io/x402)
- [CDP Discord](https://discord.com/invite/cdp)
