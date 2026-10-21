import { useState } from "react";

// Reveals items in batches; the batch resets whenever resetKey (search/filters) changes.
export const usePaged = <T>(items: T[], resetKey: string, size = 12) => {
  const [state, setState] = useState({ key: resetKey, limit: size });
  const limit = state.key === resetKey ? state.limit : size;
  return {
    visible: items.slice(0, limit),
    remaining: Math.max(items.length - limit, 0),
    showMore: () => setState({ key: resetKey, limit: limit + size }),
  };
};
