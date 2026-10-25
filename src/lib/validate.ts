import type { ShopDetails, ShopErrors } from "@/lib/types";

export function resolvedCity(shop: ShopDetails) {
  if (shop.city === "Other") return shop.otherCity.trim();
  return shop.city.trim();
}

export function validateShop(shop: ShopDetails): ShopErrors {
  const errors: ShopErrors = {};
  if (shop.retailerName.trim().length < 2) {
    errors.retailerName = "Enter the shopkeeper name.";
  }
  if (shop.shopName.trim().length < 2) {
    errors.shopName = "Enter the shop or firm name.";
  }
  const city = resolvedCity(shop);
  if (!shop.city || city.length < 2) {
    errors.city = "Select a city or district.";
  }
  if (!/^[6-9]\d{9}$/.test(shop.mobile.trim())) {
    errors.mobile = "Enter a 10-digit mobile number.";
  }
  return errors;
}

export function hasErrors(errors: ShopErrors) {
  return Object.keys(errors).length > 0;
}
