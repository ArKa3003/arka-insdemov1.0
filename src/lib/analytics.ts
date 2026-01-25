/**
 * Analytics utilities - ready for real analytics integration.
 * Currently logs to console; swap implementation for Segment, Mixpanel, GA4, etc.
 */

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  console.log("[Analytics]", name, properties);
  // Ready for real analytics integration, e.g.:
  // if (typeof window !== "undefined" && window.analytics) {
  //   window.analytics.track(name, properties);
  // }
}

export function trackDemoStep(step: number, action: "view" | "complete" | "skip") {
  trackEvent("demo_step", { step, action });
}

export function trackROICalculation(inputs: unknown, outputs: unknown) {
  trackEvent("roi_calculation", { inputs, outputs });
}
