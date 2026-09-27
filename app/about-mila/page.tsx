import { permanentRedirect } from "next/navigation";

/** Persona page retired: the author bio now lives on the About page. */
export default function RetiredAuthorPage() {
  permanentRedirect("/about");
}
