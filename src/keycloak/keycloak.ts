import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080/",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "bidv-realm",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "bidv-client",
});

export default keycloak;
