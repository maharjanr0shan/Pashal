import axios from "axios";
import { base_url } from "../../utils/base_url";

const Product = async () => {
  try {
    const response = await axios.get(`${base_url}product?page=1&limit=5`);

    if (response) {
      console.log(response);
      return response.data;
    } else {
      throw new Error(" failed to register user");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const ProductService = { Product };
