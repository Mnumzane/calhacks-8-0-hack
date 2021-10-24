import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://app.uniswap.org/" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🦄RainbowPool🌈"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
