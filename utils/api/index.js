import queryString from "query-string";
export const opts = {
  mode: "cors",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Request-Headers": "Content-Type",
  },
};

export const fetchError = () => {
  throw new Error("There was an error fetching your data");
};

const throwErrorResponse = resp => {
  throw resp;
};

const qs = params =>
  Object.entries(params).length ? `?${queryString.stringify(params)}` : "";

const processResponse = async resp => {
  try {
    const body = await resp.json();

    if (!body.data) {
      return resp.ok ? body : throwErrorResponse(body);
    }

    return resp.ok && body.success ? body.data : throwErrorResponse(body.error);
  } catch (e) {
    return fetchError(e);
  }
};

export const get = async (url, params = {}) => {
  const response = await fetch(`${url}${qs(params)}`, {
    ...opts,
    method: "GET",
  }).catch(fetchError);

  return processResponse(response);
};
