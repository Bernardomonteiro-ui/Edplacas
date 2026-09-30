"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useRequest } from "./RequestProvider";

interface Props {
  children: ReactNode;
  productId?: string;
  variant?: "primary" | "ghost";
  className?: string;
}

/** Qualquer CTA "Solicitar" do site abre o mesmo formulário (opcionalmente com o modelo pré-selecionado). */
export function RequestButton({ children, productId, variant = "primary", className }: Props) {
  const { open } = useRequest();
  return (
    <Button variant={variant} className={className} onClick={() => open(productId)} aria-haspopup="dialog">
      {children}
    </Button>
  );
}
