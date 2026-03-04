import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("str_replace_editor + create shows 'Creating App.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("str_replace_editor + str_replace shows 'Editing Card.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/components/Card.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor + insert shows 'Editing Card.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/components/Card.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor + view shows 'Reading App.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("str_replace_editor + undo_edit shows 'Undoing edit in App.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
});

test("file_manager + rename shows 'Renaming OldName.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    args: { command: "rename", path: "/OldName.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Renaming OldName.jsx")).toBeDefined();
});

test("file_manager + delete shows 'Deleting App.jsx'", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "file_manager",
    args: { command: "delete", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("Deleting App.jsx")).toBeDefined();
});

test("unknown tool name falls back to raw tool name", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "8",
    toolName: "unknown_tool",
    args: {},
    state: "result",
    result: "Success",
  };
  render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("in-progress state shows spinner, not green dot", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };
  const { container } = render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("completed state shows green dot, not spinner", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "10",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
  };
  const { container } = render(<ToolInvocationBadge toolInvocation={toolInvocation} />);
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
