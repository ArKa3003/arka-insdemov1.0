interface RecommendationDisclaimerProps {
  className?: string;
}

export function RecommendationDisclaimer({
  className,
}: RecommendationDisclaimerProps) {
  return (
    <p
      className={
        className ??
        'text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200'
      }
    >
      <strong>Important:</strong> AIIE predictions support utilization
      management decisions but do not constitute clinical recommendations or
      replace medical judgment. Final authorization decisions rest with qualified
      reviewers.
    </p>
  );
}
