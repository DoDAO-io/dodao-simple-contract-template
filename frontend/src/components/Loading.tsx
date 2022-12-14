import React from "react";

export interface LoadingProps {
  contents: string;
}


export function Loading({ contents }: LoadingProps) {
  return (
    <div>
      <div>
        <div>
          <span>Loading... </span>
          {contents ? <span>{contents}</span> : null}
        </div>
      </div>
    </div>
  );
}
