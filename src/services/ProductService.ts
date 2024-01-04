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
  getProduct(id: number, token: string) {
    return apiClient.post("/product/" + id, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getProducts(userId: number, perPage: number, page: number) {
    return apiClient.post("/products/" + perPage + "/" + page, { userid: userId });
  },
  getProductsByCat(category: string, perPage: number, page: number) {
    return apiClient.get(
      "/products/" + category + "?_limit=" + perPage + "&_page=" + page
    );
  },
  getRatingsDetails(product_id: number) {
    return apiClient.get('/product/rating-details/' + product_id);
  }

  // getSearch(expression) {
  //   return apiClient.get("/search", {
  //     params: {
  //       q: expression,
  //     },
  //   });
  // },
};
