#!/bin/bash

# Configuration
PROMPT_FILE=".ralph/prompt.md"
AGENT_COMMAND="claude" # Replace with your specific agent command (e.g., 'antigravity', 'claude', etc.)
FLAGS="--dangerously-skip-permissions" 

echo "🚀 Starting Ralph Loop..."
echo "Press [CTRL+C] to stop."

while true; do
  # Run the agent with the prompt
  # We capture the output to check for the exit condition
  
  # Note: Depending on the agent, we might need to pipe prompt.md content 
  # or pass it as an argument. The standard Ralph loop pipes it.
  
  OUTPUT=$(cat "$PROMPT_FILE" | $AGENT_COMMAND $FLAGS)
  
  # Print output to console so user can see progress
  echo "$OUTPUT"
  
  # Check for "Promise" exit condition
  if echo "$OUTPUT" | grep -q "promise complete promise"; then
    echo "✅ All tasks completed. Ralph is sleeping."
    break
  fi
  
  # Independent check of the PRD file (optional failsafe)
  if grep -q '"status": "pending"' .ralph/prd.json; then
      echo "🔄 Task pending. Restarting loop..."
      sleep 2 # Short pause to prevent hammering APIs if something errors instantly
  else
      echo "✅ No pending tasks found in JSON. Exiting."
      break
  fi
  
done
