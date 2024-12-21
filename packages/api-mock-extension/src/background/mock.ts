(function () {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();

    // 修改数据
    if (data) {
      data.modified = true;
    }

    return new Response(JSON.stringify(data), {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  };
})();
