/**
 * Extracts unique, meaningful keywords from text content for search indexing.
 * Filters out common stop words and short words for better search relevance.
 * 
 * @param text The text content to extract keywords from
 * @param maxKeywords Maximum number of keywords to return (default: 50)
 * @returns Array of unique lowercase keywords
 */
export function extractKeywords(text: string, maxKeywords: number = 50): string[] {
    // Common stop words to filter out
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
        'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
        'she', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why',
        'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
        'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too',
        'very', 'just', 'about', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'between', 'under', 'again', 'further',
        'then', 'once', 'here', 'there', 'out', 'up', 'down', 'off', 'over',
        'own', 'because', 'while', 'if', 'my', 'your', 'our', 'their', 'his',
        'her', 'them', 'us', 'me', 'him', 'myself', 'yourself', 'itself'
    ]);

    // Extract words, lowercase, filter
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(word =>
            word.length >= 3 &&
            !stopWords.has(word) &&
            !/^\d+$/.test(word) // Filter out pure numbers
        );

    // Count frequency for relevance
    const wordCount = new Map<string, number>();
    for (const word of words) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }

    // Sort by frequency and take top keywords
    return Array.from(wordCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxKeywords)
        .map(([word]) => word);
}
