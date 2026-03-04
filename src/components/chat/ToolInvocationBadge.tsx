"use client";

import { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const filename = path ? path.split("/").pop() || path : "";
  const command = typeof args.command === "string" ? args.command : "";

  if (toolName === "str_replace_editor") {
    if (command === "create") return `Creating ${filename}`;
    if (command === "str_replace") return `Editing ${filename}`;
    if (command === "insert") return `Editing ${filename}`;
    if (command === "view") return `Reading ${filename}`;
    if (command === "undo_edit") return `Undoing edit in ${filename}`;
  }

  if (toolName === "file_manager") {
    if (command === "rename") return `Renaming ${filename}`;
    if (command === "delete") return `Deleting ${filename}`;
  }

  return toolName;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const label = getLabel(toolInvocation.toolName, toolInvocation.args as Record<string, unknown>);
  const isComplete = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
