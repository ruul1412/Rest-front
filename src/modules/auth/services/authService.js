import api from "../../../shared/services/apiClient";
import API_ROUTES from "../../../shared/services/apiRoutes"

export const loginRequest = async (credentials) => {
  const res = await api.post(API_ROUTES.auth.login, credentials);
  return res.data;  // { access_token, token_type }
};

export const getMe = async () => {
  const res = await api.get(API_ROUTES.auth.me);
  return res.data;  // { id, email, full_name, role_code, role_name, is_active }
};