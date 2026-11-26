import api from "../../../shared/services/apiClient";
import API_ROUTES from "../../../shared/services/apiRoutes";

export const loginRequest = async (credentials) => {
  const res = await api.post(API_ROUTES.auth.login, credentials);
  return res.data;
};

export const selectBranchRequest = async (selectionToken, branchId) => {
  const res = await api.post(API_ROUTES.auth.selectBranch, {
    selection_token: selectionToken,
    branch_id: branchId,
  });

  return res.data;
};

export const getMe = async () => {
  const res = await api.get(API_ROUTES.auth.me);
  return res.data;
};