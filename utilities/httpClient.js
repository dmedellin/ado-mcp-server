async function makeApiRequest({
  endpoint,
  method,
  body = null,
  token = null,
  organization = null,
}) {
  const finalToken = token && token.trim() !== "" ? token : process.env.token;
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
      : process.env.organization;
  if (!finalOrg || finalOrg.trim() === "") {
    console.error(
      "[makeApiRequest] Error: No organization provided. " +
        "Client payload was empty or missing, and process.env.organization is unset."
    );
    throw new Error(
      "Organization is required but was not provided to makeApiRequest."
    );
  }

  const baseUrl = `https://dev.azure.com/${encodeURIComponent(finalOrg)}/_apis`;
  const apiUrl = `${baseUrl}/${
    endpoint.startsWith("/") ? endpoint.substring(1) : endpoint
  }`;

  const headers = {
    "Content-Type": "application/json",
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

  // Handle cases where response might be empty (e.g., 204 No Content)
  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
}

export { makeApiRequest };
