"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NavDrawerImpl = dynamic(() => import("./nav-drawer"), { ssr: false });

interface LazyNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export default function LazyNavDrawer(props: LazyNavDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (props.isOpen && !mounted) {
      setMounted(true);
    }
  }, [props.isOpen, mounted]);

  if (!mounted && !props.isOpen) return null;
  return <NavDrawerImpl {...props} />;
}
