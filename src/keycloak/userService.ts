import keycloak from "./keycloak";

const initKeycloak = (onAuthenticatedCallback: Function) => {
  // khởi tạo đối tượng keycloak
  keycloak
    .init({
      onLoad: "login-required",
    })
    .then((authenticated: boolean) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const getKeyCloack = () => keycloak;

const doLogin = keycloak.login; // đăng nhập

const doLogout = keycloak.logout; // đăng xuất

const getToken = () => keycloak.token; // lấy token

const isLoggedIn = () => keycloak.authenticated; // kiểm tra trạng thái đăng nhập

const getUsername = () => keycloak.tokenParsed?.realm_access; // lấy thông tin user

const getUserInfo = async () => await keycloak.loadUserProfile();

const hasRole = (roles: string[]) =>
  roles.some((role: string) => keycloak.hasRealmRole(role)); // kiểm tra quyền

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getUsername,
  hasRole,
  getKeyCloack,
  getUserInfo,
};

export default UserService;
