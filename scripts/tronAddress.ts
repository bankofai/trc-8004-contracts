/**
 * Convert TRON address (base58 or 41-prefixed hex) to 0x hex for ethers/ABI.
 * Returns unchanged if already 0x-prefixed.
 */
export function toHexAddress(addr: string): string {
  if (!addr || typeof addr !== 'string') return addr;
  if (addr.startsWith('0x')) return addr;
  // TRON hex: 41 + 40 chars -> 0x + 40 chars
  if (addr.startsWith('41') && addr.length === 42) return '0x' + addr.slice(2);
  // TRON base58 (T-prefix) -> hex (41 + 40 chars) -> 0x + 40 chars
  try {
    const TronWeb = require('tronweb');
    const hex = TronWeb.address.toHex(addr);
    if (hex && hex.startsWith('41')) return '0x' + hex.slice(2);
  } catch (_) {}
  return addr;
}
