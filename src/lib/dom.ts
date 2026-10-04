// src/lib/dom.ts
export function cloneTemplate(id: string): HTMLElement | null {
  const tpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tpl) return null;

  const frag = tpl.content.cloneNode(true) as DocumentFragment;
  return frag.firstElementChild as HTMLElement | null;
}