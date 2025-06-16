class httpx {
  static get(url, options = {}) {
    return request(url, { method: "GET", ...options });
  }
  static post(url, data, options = {}) {
    return request(url, { method: "POST", body: data, ...options });
  }
  static patch(url, data, options = {}) {
    return request(url, { method: "PATCH", body: data, ...options });
  }
  static put(url, data, options = {}) {
    return request(url, { method: "PUT", body: data, ...options });
  }
  static delete(url, options = {}) {
    return request(url, { method: "DELETE", ...options });
  }
}

export default httpx;

async function request(url, config) {
  const { headers, body, ...rest } = config;
  const options = Object.assign(
    {
      method: "GET",
    },
    rest
  );

  if (config.method !== "GET" && config.method !== "HEAD") {
    if (body instanceof FormData || body instanceof URLSearchParams) {
      options.body = body;
    } else if (typeof body === "string") {
      options.body = body;
      options.headers["Content-Type"] = "text/plain";
    } else if (body !== undefined) {
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
    throw new Error(error.message || "Something went wrong");
  }

  return new ParsedResponse(res);
}

class ParsedResponse {
  constructor(res) {
    this._res = res.clone();
    this.status = this._res.status;
    this.statusText = this._res.statusText;
    this.headers = this._res.headers;
    this.ok = this._res.ok;
    this.url = this._res.url;
    this.type = this._res.type;
    this.redirected = this._res.redirected;
    this.contentType = this._res.headers.get("content-type") || "";
  }

  async text() {
    return await this._res.text();
  }

  async json() {
    return await this._res.json();
  }

  async blob() {
    return await this._res.blob();
  }

  async arrayBuffer() {
    return await this._res.arrayBuffer();
  }

  async formData() {
    return await this._res.formData();
  }

  async default() {
    const type = this.contentType;
    try {
      switch (true) {
        case type.includes("application/json"):
          return await this._res.json();
        case type.includes("text/"):
          return await this._res.text();
        case type.includes("application/pdf"):
        case type.includes("image/"):
        case type.includes("application/octet-stream"):
          return await this._res
            .blob()
            .catch(async () => await this._res.arrayBuffer());
        case type.includes("multipart/form-data"):
          return await this._res.formData();
        case type.includes("application/x-www-form-urlencoded"):
          const text = await this._res.text();
          return new URLSearchParams(text);
        default:
          return await this._res.text();
      }
    } catch (err) {
      console.warn("Response parse failed:", err);
      return await this._res.arrayBuffer().catch(() => null);
    }
  }
}
