interface Env {}
export default {
  async fetch(request, env, ctx): Promise<Response> {
    const cacheUrl = new URL(request.url);

    // Construct the cache key from the cache URL
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from origin, and store it in the cache
    let response = await cache.match(cacheKey);

    if (!response) {
      console.log(
        `Response for request url: ${request.url} not present in cache. Fetching and caching request.`
      );
      // If not in cache, get it from origin
      const currentTime = Date.now();
      const currentTimeIso = new Date(currentTime).toISOString();
      const someHash = await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(currentTimeIso))
        .then((hash) =>
          Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
        );

      // Must use Response constructor to inherit all of response's fields
      response = new Response(
        JSON.stringify({
          currentTime,
          currentTimeIso,
          someHash,
        }),
        {
          headers: {
            "Cache-Control": "s-maxage=10",
            "Content-Type": "application/json",
          },
        }
      );

      // Cache API respects Cache-Control headers. Setting s-max-age to 10
      // will limit the response to be in cache for 10 seconds max

      // Any changes made to the response here will be reflected in the cached value
      response.headers.append("Cache-Control", "s-maxage=10");

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    } else {
      console.log(`Cache hit for: ${request.url}.`);
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
