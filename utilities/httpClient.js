async function makeApiRequest({
  endpoint,
  method,
  body = null,
  token = null,
  organization = null,
  contentType = "application/json"
}) {
  const finalToken = token && token.trim() !== "" ? token : process.env.ADO_TOKEN;
  if (!finalToken || finalToken.trim() === "") {
    console.error(
      "[makeApiRequest] Error: No token provided. " +
        "Client payload was empty or missing, and process.env.token is unset."
    );
    throw new Error(
      "Token is required but was not provided to makeApiRequest."
    );
  }

  const finalOrg =
    organization && organization.trim() !== ""
      ? organization
      : process.env.ADO_ORGANIZATION;
  if (!finalOrg || finalOrg.trim() === "") {
    console.error(
      "[makeApiRequest] Error: No organization provided. " +
        "Client payload was empty or missing, and process.env.organization is unset."
    );
    throw new Error(
      "Organization is required but was not provided to makeApiRequest."
    );
  }

  const baseUrl = `https://dev.azure.com/${encodeURIComponent(finalOrg)}/`;
  const apiUrl = `${baseUrl}/${
    endpoint.startsWith("/") ? endpoint.substring(1) : endpoint
  }`;

  const headers = {
    "Content-Type": contentType,
  };

  if (finalToken) {
    headers["Authorization"] =
      "Basic " + Buffer.from(`:${finalToken}`).toString("base64");
  }

  const config = {
    method: method,
    headers: headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(apiUrl, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorText}`
    );
  }

  const headerWhitelist = ["x-ms-continuationtoken"];
  const responseHeaders = {};
  response.headers.forEach((value, name) => {
    if (headerWhitelist.includes(name.toLowerCase())) {
      responseHeaders[name] = value;
    }
  });

  const responseText = await response.text();
  let responseBody = null;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse response JSON:", error);
      // Optionally, you could throw the error or return the raw text
      // For now, keeping responseBody as null if parsing fails
    }
  }

  return {
    body: responseBody,
    headers: responseHeaders,
  };
}

export { makeApiRequest };
