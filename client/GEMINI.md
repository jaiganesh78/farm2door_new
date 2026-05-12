# Farm2Door Frontend Development Rules

## IMPORTANT
This is an EXISTING production-oriented frontend project.

DO NOT:
- regenerate the application
- rewrite unrelated modules
- replace architecture
- change folder structure unnecessarily
- introduce new state libraries
- introduce mock APIs
- create duplicate services/hooks/stores
- create duplicate UI components
- modify working modules without reason

## REQUIRED DEVELOPMENT STYLE

All modifications must:
- preserve current architecture
- be minimal and safe
- be production-grade
- be backend-compatible
- reuse existing patterns
- avoid dead code
- avoid hardcoded values
- include proper loading/error states
- include cleanup for effects/sockets

## API RULES

- use centralized axios client only
- preserve JWT auth flow
- preserve interceptor structure
- never hardcode API URLs
- use environment variables
- preserve backend contract shapes

## ZUSTAND RULES

- reuse existing stores
- do not create duplicate auth stores
- do not create duplicate listing stores
- preserve existing state architecture
- avoid unnecessary global state

## SOCKET RULES

- always cleanup socket listeners
- avoid duplicate socket connections
- preserve room-based architecture
- preserve authenticated socket flow

## UI RULES

UI must look:
- modern
- minimal
- production-grade
- startup-quality

Avoid:
- cluttered layouts
- inconsistent spacing
- random colors
- oversized cards
- poor mobile responsiveness

## BEFORE MODIFYING CODE

Always:
1. analyze existing implementation
2. explain root issue
3. list files requiring edits
4. explain reasoning
5. make minimal safe modifications

## OUTPUT RULES

Before coding:
- explain findings
- explain implementation plan

After coding:
- summarize modified files
- explain why changes were made
- mention any risks or follow-up work