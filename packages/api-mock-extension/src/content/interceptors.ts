export const setupInterceptors = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();

    return new Promise((resolve) => {
      chrome.storage.local.get("mockData", (result) => {
        const modifiedData = result.mockData || { ...data, modified: true };

        resolve(
          new Response(JSON.stringify(modifiedData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          })
        );
      });
    });
  };
};
