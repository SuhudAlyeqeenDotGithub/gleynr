"use client";

export const Logo = ({
  collapsed = false,
  dark,
}: {
  collapsed?: boolean;
  dark: boolean;
}) => (
  <div className="brand">
    <div
      className={`relative h-10 w-10 shrink-0 overflow-hidden rounded ${
        dark ? "bg-white" : "bg-transparent"
      }`}
    >
      <img
        src="/brand/gleynr-symbol.png"
        alt="Gleynr symbol"
        className="absolute left-0 top-0 h-10 w-auto max-w-none"
      />
    </div>

    {!collapsed && (
      <div className="relative h-10 w-[100px] shrink-0 overflow-hidden">
        <img
          src={`/brand/gleynr-wordmark${!dark ? "-dark" : "-light"}.png`}
          alt="Gleynr wordmark"
          className="absolute left-0 top-0 h-10 w-auto max-w-none"
        />
      </div>
    )}
  </div>
);