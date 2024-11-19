import axios from "axios";
import { base_url } from "../../utils/base_url";

const Category = async () => {
  try {
    const response = await axios.get(`${base_url}category`);

    if (response) {
      console.log(response);
      return response.data;
    } else {
      throw new Error("failed to get category");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const CategoryService = { Category };
