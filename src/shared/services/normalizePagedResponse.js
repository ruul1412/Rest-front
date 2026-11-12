const isStandardApiResponse = (payload) =>
  payload && typeof payload === "object" && !Array.isArray(payload) && "success" in payload && "data" in payload;

export const normalizePagedResponse = (response, requestedPage, requestedPageSize) => {
  const envelopes = [];
  let payload = response;

  while (isStandardApiResponse(payload)) {
    envelopes.push(payload);
    payload = payload.data;
  }

  const getMetadata = (key) =>
    payload?.[key] ?? envelopes.find((envelope) => envelope[key] != null)?.[key];

  if (Array.isArray(payload)) {
    const total = Number(getMetadata("total") ?? payload.length);
    const hasServerPagination =
      getMetadata("page") != null ||
      getMetadata("page_size") != null ||
      total > payload.length;
    const start = (requestedPage - 1) * requestedPageSize;

    return {
      items: hasServerPagination ? payload : payload.slice(start, start + requestedPageSize),
      total,
      page: Number(getMetadata("page") ?? requestedPage),
      page_size: Number(getMetadata("page_size") ?? requestedPageSize),
    };
  }

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: Number(getMetadata("total") ?? payload.items.length),
      page: Number(getMetadata("page") ?? requestedPage),
      page_size: Number(getMetadata("page_size") ?? requestedPageSize),
    };
  }

  return { items: [], total: 0, page: requestedPage, page_size: requestedPageSize };
};
