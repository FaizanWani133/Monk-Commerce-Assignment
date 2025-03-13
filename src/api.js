export async function fetchProducts({
  search = "",
  page = 1,
  limit = 10,
} = {}) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}
