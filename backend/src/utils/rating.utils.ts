interface Tool {
  id: number;
  reviews?: Array<{ overall_rating: number }>;
}

export interface ToolWithRating extends Tool {
  rating: number;
  total_reviews: number;
}

/**
 * Calculate rating for a single tool
 */
export function addToolRating(tool: Tool): ToolWithRating {
  const reviews = tool.reviews || [];
  const rating =
    reviews.length > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(2)
        )
      : 0;

  return {
    ...tool,
    rating,
    total_reviews: reviews.length,
  };
}

/**
 * Calculate ratings for multiple tools
 */
export function addToolsRatings(tools: Tool[]): ToolWithRating[] {
  return tools.map(addToolRating);
}
