#!/bin/bash

# Fix dashboard/page.tsx
sed -i '' '/import.*motion/d' src/app/dashboard/page.tsx
sed -i '' '/complianceStatus.*setComplianceStatus/d' src/app/dashboard/page.tsx

# Fix appeal-risk-dashboard.tsx
sed -i '' '/import.*Progress/d' src/components/dashboard/appeal-risk-dashboard.tsx
sed -i '' 's/XCircle, //g' src/components/dashboard/appeal-risk-dashboard.tsx
sed -i '' 's/, Info//g' src/components/dashboard/appeal-risk-dashboard.tsx
sed -i '' '/import.*Legend/d' src/components/dashboard/appeal-risk-dashboard.tsx
sed -i '' '/import.*SimpleTooltip/d' src/components/dashboard/appeal-risk-dashboard.tsx

echo "Files fixed! Review changes with 'git diff'"
