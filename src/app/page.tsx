import { HomePage } from "@/components/HomePage";
import { CatalogProvider } from "@/context/CatalogContext";

export default function Page() {
  return (
    <CatalogProvider>
      <HomePage />
    </CatalogProvider>
  );
}
