// Shared order-number generator used by both the storefront checkout API
// and the admin manual-order action, so every order shares one EHM-… scheme.
export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EHM-${stamp}-${rand}`;
}
