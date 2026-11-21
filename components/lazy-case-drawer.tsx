"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCase } from "@/context/case-context";

const CaseDrawerImpl = dynamic(() => import("./case-drawer"), { ssr: false });

export default function LazyCaseDrawer() {
  const { isCaseOpen } = useCase();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isCaseOpen && !mounted) {
      setMounted(true);
    }
  }, [isCaseOpen, mounted]);

  if (!mounted && !isCaseOpen) return null;
  return <CaseDrawerImpl />;
}
