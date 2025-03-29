
// Rate limiter implementation
export const rateLimiter = {
  // Store timestamps of requests
  requests: [] as number[],
  // Maximum requests allowed in the time window
  maxRequests: 10,
  // Time window in milliseconds (30 seconds)
  timeWindow: 30000,
  
  // Check if a new request is allowed
  isAllowed: function(): boolean {
    const now = Date.now();
    // Remove timestamps outside the time window
    this.requests = this.requests.filter(time => time > now - this.timeWindow);
    
    // If we haven't hit the limit, allow the request
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  },
  
  // Get remaining time until next available request slot
  getWaitTime: function(): number {
    const now = Date.now();
    if (this.requests.length === 0) return 0;
    
    // Sort requests by timestamp (oldest first)
    const sortedRequests = [...this.requests].sort((a, b) => a - b);
    // When the oldest request will expire
    const oldestExpiry = sortedRequests[0] + this.timeWindow;
    
    return Math.max(0, oldestExpiry - now);
  }
};
