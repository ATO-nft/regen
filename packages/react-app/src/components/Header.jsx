
import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/julienbrg/regen" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 regen"
        subTitle="Regen Generative Art NFT"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
