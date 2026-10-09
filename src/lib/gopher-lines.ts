interface CaseLike {
  metrics: { label: string; before?: string | undefined; after: string }[];
}

/** One short, factual line per case, built from its first metric. */
export function buildGopherLines(cases: readonly CaseLike[]): string[] {
  return cases.flatMap((item) => {
    const metric = item.metrics[0];
    if (!metric) return [];
    return metric.before
      ? [`${metric.label}: de ${metric.before} para ${metric.after}.`]
      : [`${metric.label}: ${metric.after}.`];
  });
}
