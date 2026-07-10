import { MegaIdentity } from "./megaCrypto";

export interface MegaResult {
  code: number;
  msg: string;
  data?: unknown;
  trace_id?: string;
}

/** Picture-captcha challenge returned by `passport/generate/captcha`. `item` is a base64 image. */
export interface MegaCaptcha {
  captcha_id: string;
  item: string;
}

/** Caller's captcha answer, passed back into the login call. */
export interface MegaCaptchaAnswer {
  captchaId: string;
  answer: string;
}

/** Raw `devicemanage/get_user_mqtt_info` payload (AWS IoT mutual-TLS credentials). */
export interface MegaUserMqttInfo {
  endpoint_addr: string;
  certificate_pem: string;
  private_key: string;
  aws_root_ca1_pem: string;
  thing_name: string;
  certificate_id: string;
  user_id: string;
  app_name: string;
}

/**
 * Everything needed to open the v6 AWS IoT (mutual-TLS) MQTT connection, assembled so a consumer
 * never has to reach into MegaHTTPApi internals. Topics use `PN`/`SN` placeholders to fill per
 * device (`cmd/eufy_security/PN/SN/res`, …) — see SecurityMqttConstant in the v6 app.
 */
export interface MegaMqttConnectConfig {
  endpoint: string;
  port: number;
  clientId: string;
  thingName: string;
  userId: string;
  certificatePem: string;
  privateKey: string;
  awsRootCaPem: string;
  topics: { subCmd: string; stateInfo: string; pubCmd: string };
}

export interface MegaApiOptions {
  /** Region/AB code, e.g. "fr", "us". Drives estimate_domain. */
  ab: string;
  /** os-type — MUST be "android" for the identity to route events via FCM. */
  osType?: "android" | "iOS";
  appName?: string;
  appVersion?: string;
  osVersion?: string;
  phoneModel?: string;
  /** Stable per-install device id. Seed it from the existing persisted openudid so the v6 client
   *  presents the same device as the legacy path instead of a fresh id each run. */
  openudid?: string;
  /** Min delay between requests in ms (WAF-friendly). Default 3000. */
  minRequestIntervalMs?: number;
}

/**
 * Serializable session for resume-without-relogin (see {@link MegaHTTPApi.exportSession}).
 *
 * Field names intentionally mirror the legacy `EufySecurityPersistentData` / `HTTPApiPersistentData`
 * conventions (`openudid`, `cloud_token`, `cloud_token_expiration`, `login_hash`, `user_id`) so this
 * can slot into the existing persistence layer. `login_hash = md5(user:pass)` lets the consumer
 * invalidate the cached session when credentials change — exactly like HTTPApi does.
 */
export interface MegaSession {
  ab: string;
  openudid: string;
  login_hash?: string;
  cloud_token?: string;
  cloud_token_expiration?: number;
  user_id?: string;
  domains?: Record<string, string>;
  megaDomain?: string;
  /** Per-cluster ECDH identities (keyIdent + sharedKey + clientPublicKey). */
  identities?: Record<string, MegaIdentity>;
}

/** Member block of a v6 `house/get_devs_list` device entry (owner/share info of the calling account). */
export interface MegaDevsListMember {
  action_user_id: string;
  action_user_name: string;
  admin_user_id: string;
  avatar: string;
  email: string;
  member_type: number;
  member_user_id: string;
  nick_name: string;
  short_user_id: string;
  create_time: number;
  readonly [index: string]: unknown;
}

/** Device parameter of a v6 `house/get_devs_list` entry. Same param_type/param_value domain as the legacy API. */
export interface MegaDevsListParam {
  param_type: number;
  param_value: string;
  update_time: number;
}

/**
 * One device entry of the v6 `house/get_devs_list` response.
 *
 * The v6 list is flat: hubs and their attached devices, as well as standalone devices, all appear
 * as entries. `parent_sn` links a device to its station — standalone devices carry their own serial
 * (`parent_sn === device_sn`) or an empty string.
 */
export interface MegaDevsListDevice {
  device_sn: string;
  parent_sn: string;
  device_name: string;
  device_model: string;
  device_type: number;
  device_channel: number;
  p2p_did: string;
  p2p_conn: string;
  app_conn: string;
  p2p_license: string;
  local_ip: string;
  ip_addr: string;
  main_sw_version: string;
  main_hw_version: string;
  sec_sw_version: string;
  sec_hw_version: string;
  main_sw_time: number;
  sec_sw_time: number;
  software_version: string;
  hardware_version: string;
  wifi_ssid: string;
  wifi_mac: string;
  bt_mac: string;
  time_zone: string;
  setup_code: string;
  setup_id: string;
  cover_path: string;
  cover_time: number;
  bind_time: number;
  create_time: number;
  update_time: number;
  event_num: number;
  is_init_complete: boolean;
  virtual_version: string;
  house_id: string;
  member: MegaDevsListMember;
  params: Array<MegaDevsListParam>;
  charging_days: number;
  charing_total: number;
  charging_reserve: number;
  charging_missing: number;
  battery_usage_last_week: number;
  relate_devices: unknown;
  readonly [index: string]: unknown;
}

/** Decrypted v6 `house/get_devs_list` response. */
export interface MegaDevsListResponse {
  devices: Array<MegaDevsListDevice>;
  groups?: unknown;
}
