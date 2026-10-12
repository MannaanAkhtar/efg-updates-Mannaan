"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

/**
 * Collects every `<style jsx>` block rendered on the server and writes it into
 * the HTML response. Without this the App Router sends pages with no styled-jsx
 * CSS at all: the rules only arrive once JavaScript has loaded, so the first
 * paint is unstyled (wrong layout, no media queries) and then jumps.
 */
export default function StyledJsxRegistry({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}
