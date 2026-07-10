import axios from "axios";
import { useQuery } from "react-query";

const useProducts = () => {
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "https://ub-jewellers-server-production.up.railway.app";
      const res = await axios.get(`${apiBaseUrl}/products`);
      return res.data;
    },
  });

  return [products, isProductsLoading, refetch];
};

export default useProducts;
