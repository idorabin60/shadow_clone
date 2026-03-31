#!/bin/bash
# PostToolUse hook: auto-typecheck after Write/Edit on .ts/.tsx files
FILE=$(jq -r '.tool_input.file_path // .tool_response.filePath' 2>/dev/null)

if echo "$FILE" | grep -q 'agent-backend/.*\.ts$'; then
  cd agent-backend && npx tsc --noEmit 2>&1 | head -20
elif echo "$FILE" | grep -qE '\.(ts|tsx)$'; then
  npx tsc --noEmit 2>&1 | head -20
fi
exit 0
