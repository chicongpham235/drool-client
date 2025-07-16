import { KeycloakProfile } from "keycloak-js";
import { User } from "../user/user";

export interface AuthState {
  logged: boolean;
  currentUser?: KeycloakProfile;
  loading: boolean;
  loadingInfo: boolean;
  errorMessage: any;
}
