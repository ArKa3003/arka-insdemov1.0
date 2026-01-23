#!/bin/bash

# Fix audit-trail-viewer.tsx
sed -i '' '/Calendar.*from/d' src/components/dashboard/audit-trail-viewer.tsx
sed -i '' '/Filter.*from/d' src/components/dashboard/audit-trail-viewer.tsx
sed -i '' '/reviewerFilter.*setReviewerFilter/d' src/components/dashboard/audit-trail-viewer.tsx
sed -i '' '/selectedRecord.*setSelectedRecord/d' src/components/dashboard/audit-trail-viewer.tsx

# Fix cms-compliance-tracker.tsx
sed -i '' 's/ArrowRight, //g' src/components/dashboard/cms-compliance-tracker.tsx
sed -i '' 's/, ArrowRight//g' src/components/dashboard/cms-compliance-tracker.tsx
sed -i '' '/activeTab.*setActiveTab/d' src/components/dashboard/cms-compliance-tracker.tsx
sed -i '' '/const getStatusColor/d' src/components/dashboard/cms-compliance-tracker.tsx

# Fix gold-card-dashboard.tsx
sed -i '' 's/Calendar, //g' src/components/dashboard/gold-card-dashboard.tsx
sed -i '' 's/, Calendar//g' src/components/dashboard/gold-card-dashboard.tsx

# Fix metric-card.tsx
sed -i '' 's/Info, //g' src/components/dashboard/metric-card.tsx
sed -i '' 's/, Info//g' src/components/dashboard/metric-card.tsx
sed -i '' '/SimpleTooltip.*from/d' src/components/dashboard/metric-card.tsx

# Fix metrics-overview.tsx
sed -i '' '/Progress.*from/d' src/components/dashboard/metrics-overview.tsx
sed -i '' '/dateRange.*=/d' src/components/dashboard/metrics-overview.tsx

echo "Part 2 fixed! Review changes with 'git diff'"
