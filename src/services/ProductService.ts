import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:1337/api/v1`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default {
  getCategories() {
    return apiClient.get("/categories");
  },
  getProduct(id: number) {
    return apiClient.get("/product/" + id);
  },
  getProducts(perPage: number, page: number) {
    return apiClient.get("/products/" + perPage + "/" + page);
  },
  getProductsByCat(category: string, perPage: number, page: number) {
    return apiClient.get(
      "/products/" + category + "?_limit=" + perPage + "&_page=" + page
    );
  },
  // getSearch(expression) {
  //   return apiClient.get("/search", {
  //     params: {
  //       q: expression,
  //     },
  //   });
  // },
};