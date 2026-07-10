import { DeviceListResponse, Member, ParameterResponse, StationListDevice, StationListResponse } from "./models";
import type { MegaDevsListDevice, MegaDevsListMember } from "./megaInterfaces";

/**
 * Maps the flat v6 `house/get_devs_list` inventory onto the legacy station/device response shapes
 * so the whole downstream stack (HTTPApi stores, Station/Device construction, P2P sessions) works
 * unchanged when the legacy API is unavailable.
 */

function mapMember(member: MegaDevsListMember | undefined, stationSN: string, houseId: string): Member {
  return {
    family_id: 0,
    station_sn: stationSN,
    admin_user_id: member?.admin_user_id ?? "",
    member_user_id: member?.member_user_id ?? "",
    short_user_id: member?.short_user_id ?? "",
    member_type: member?.member_type ?? 0,
    permissions: 0,
    member_nick: member?.nick_name ?? "",
    action_user_id: member?.action_user_id ?? "",
    fence_state: 0,
    extra: "",
    member_avatar: member?.avatar ?? "",
    house_id: houseId,
    create_time: member?.create_time ?? 0,
    update_time: 0,
    status: 1,
    email: member?.email ?? "",
    nick_name: member?.nick_name ?? "",
    avatar: member?.avatar ?? "",
    action_user_email: member?.email ?? "",
    action_user_name: member?.action_user_name ?? "",
  };
}

function mapParams(device: MegaDevsListDevice, stationSN: string): Array<ParameterResponse> {
  return (device.params ?? []).map((param) => ({
    param_id: 0,
    station_sn: stationSN,
    param_type: param.param_type,
    param_value: param.param_value,
    create_time: 0,
    update_time: param.update_time ?? 0,
    status: 1,
  }));
}

/** The station serial a v6 device entry belongs to (itself when standalone). */
export function megaDeviceStationSN(device: MegaDevsListDevice): string {
  return device.parent_sn && device.parent_sn !== "" ? device.parent_sn : device.device_sn;
}

function mapStationListDevice(device: MegaDevsListDevice): StationListDevice {
  return {
    device_id: 0,
    is_init_complete: device.is_init_complete ?? true,
    device_sn: device.device_sn,
    device_name: device.device_name ?? "",
    device_model: device.device_model ?? "",
    time_zone: device.time_zone ?? "",
    device_type: device.device_type,
    device_channel: device.device_channel ?? 0,
    station_sn: megaDeviceStationSN(device),
    schedule: "",
    schedulex: "",
    wifi_mac: device.wifi_mac ?? "",
    sub1g_mac: "",
    main_sw_version: device.main_sw_version ?? "",
    main_hw_version: device.main_hw_version ?? "",
    sec_sw_version: device.sec_sw_version ?? "",
    sec_hw_version: device.sec_hw_version ?? "",
    sector_id: 0,
    event_num: device.event_num ?? 0,
    wifi_ssid: device.wifi_ssid ?? "",
    ip_addr: device.ip_addr ?? "",
    main_sw_time: device.main_sw_time ?? 0,
    sec_sw_time: device.sec_sw_time ?? 0,
    bind_time: device.bind_time ?? 0,
    local_ip: device.local_ip ?? "",
    language: "",
    sku_number: "",
    lot_number: "",
    cpu_id: "",
    create_time: device.create_time ?? 0,
    update_time: device.update_time ?? 0,
    status: 1,
  };
}

/** Map one v6 device entry to the legacy device-list shape consumed by `Device`. */
export function mapMegaDeviceToDeviceListResponse(device: MegaDevsListDevice): DeviceListResponse {
  const stationSN = megaDeviceStationSN(device);
  return {
    device_id: 0,
    is_init_complete: device.is_init_complete ?? true,
    device_sn: device.device_sn,
    device_name: device.device_name ?? "",
    device_model: device.device_model ?? "",
    time_zone: device.time_zone ?? "",
    device_type: device.device_type,
    device_channel: device.device_channel ?? 0,
    station_sn: stationSN,
    schedule: "",
    schedulex: "",
    wifi_mac: device.wifi_mac ?? "",
    sub1g_mac: "",
    main_sw_version: device.main_sw_version ?? "",
    main_hw_version: device.main_hw_version ?? "",
    sec_sw_version: device.sec_sw_version ?? "",
    sec_hw_version: device.sec_hw_version ?? "",
    sector_id: 0,
    event_num: device.event_num ?? 0,
    wifi_ssid: device.wifi_ssid ?? "",
    ip_addr: device.ip_addr ?? "",
    volume: "",
    main_sw_time: device.main_sw_time ?? 0,
    sec_sw_time: device.sec_sw_time ?? 0,
    bind_time: device.bind_time ?? 0,
    bt_mac: device.bt_mac ?? "",
    cover_path: device.cover_path ?? "",
    cover_time: device.cover_time ?? 0,
    local_ip: device.local_ip ?? "",
    language: "",
    sku_number: "",
    lot_number: "",
    cpu_id: "",
    create_time: device.create_time ?? 0,
    update_time: device.update_time ?? 0,
    status: 1,
    svr_domain: "",
    svr_port: 0,
    station_conn: {
      station_sn: stationSN,
      station_name: device.device_name ?? "",
      station_model: device.device_model ?? "",
      main_sw_version: device.main_sw_version ?? "",
      main_hw_version: device.main_hw_version ?? "",
      p2p_did: device.p2p_did ?? "",
      push_did: "",
      ndt_did: "",
      p2p_conn: device.p2p_conn ?? "",
      app_conn: device.app_conn ?? "",
      binded: false,
      setup_code: device.setup_code ?? "",
      setup_id: device.setup_id ?? "",
      bt_mac: device.bt_mac ?? "",
      wifi_mac: device.wifi_mac ?? "",
      dsk_key: "",
      expiration: 0,
    },
    family_num: 0,
    member: mapMember(device.member, stationSN, device.house_id ?? ""),
    permission: null,
    params: mapParams(device, stationSN),
    pir_total: 0,
    pir_none: 0,
    pir_missing: 0,
    week_pir_total: 0,
    week_pir_none: 0,
    month_pir_total: 0,
    month_pir_none: 0,
    charging_days: device.charging_days ?? 0,
    charing_total: device.charing_total ?? 0,
    charging_reserve: device.charging_reserve ?? 0,
    charging_missing: device.charging_missing ?? 0,
    battery_usage_last_week: device.battery_usage_last_week ?? 0,
    virtual_version: device.virtual_version ?? "",
    relate_devices: device.relate_devices ?? null,
    house_id: device.house_id,
  };
}

/**
 * Synthesize the legacy station list from the flat v6 inventory: one station per unique
 * `parent_sn`. When the station has its own entry (hubs, standalone devices) that entry provides
 * the connectivity fields; otherwise the first attached device's entry is used (its
 * `p2p_did`/`p2p_conn`/`app_conn` describe the hub connection it rides on).
 */
export function synthesizeStationsFromMegaDevices(devices: Array<MegaDevsListDevice>): Array<StationListResponse> {
  const bySN = new Map<string, MegaDevsListDevice>();
  for (const device of devices) bySN.set(device.device_sn, device);

  const stations = new Map<string, StationListResponse>();
  for (const device of devices) {
    const stationSN = megaDeviceStationSN(device);
    let station = stations.get(stationSN);
    if (!station) {
      const source = bySN.get(stationSN) ?? device;
      station = {
        station_id: 0,
        station_sn: stationSN,
        station_name: source.device_name ?? "",
        station_model: source.device_model ?? "",
        time_zone: source.time_zone ?? "",
        wifi_ssid: source.wifi_ssid ?? "",
        ip_addr: source.ip_addr ?? "",
        wifi_mac: source.wifi_mac ?? "",
        sub1g_mac: "",
        main_sw_version: source.main_sw_version ?? "",
        main_hw_version: source.main_hw_version ?? "",
        sec_sw_version: source.sec_sw_version ?? "",
        sec_hw_version: source.sec_hw_version ?? "",
        volume: "",
        main_sw_time: source.main_sw_time ?? 0,
        sec_sw_time: source.sec_sw_time ?? 0,
        bt_mac: source.bt_mac ?? "",
        setup_code: source.setup_code ?? "",
        setup_id: source.setup_id ?? "",
        device_type: source.device_type,
        event_num: source.event_num ?? 0,
        sku_number: "",
        lot_number: "",
        create_time: source.create_time ?? 0,
        update_time: source.update_time ?? 0,
        status: 1,
        station_status: 1,
        status_change_time: 0,
        p2p_did: source.p2p_did ?? "",
        push_did: "",
        p2p_license: source.p2p_license ?? "",
        push_license: "",
        ndt_did: "",
        ndt_license: "",
        wakeup_flag: 0,
        p2p_conn: source.p2p_conn ?? "",
        app_conn: source.app_conn ?? "",
        wipn_enc_dec_key: "",
        wipn_ndt_aes128key: "",
        query_server_did: "",
        prefix: "",
        wakeup_key: "",
        member: mapMember(source.member, stationSN, source.house_id ?? ""),
        params: mapParams(source, stationSN),
        devices: [],
        sensor_info: null,
        is_init_complete: source.is_init_complete ?? true,
        virtual_version: source.virtual_version ?? "",
        house_id: source.house_id,
      };
      stations.set(stationSN, station);
    }
    station.devices.push(mapStationListDevice(device));
  }

  return Array.from(stations.values());
}
