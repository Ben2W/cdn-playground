import { z } from "zod";

const serviceStatusSchema = z.object({
  completed: z.boolean(),
  title: z.string(),
  active_tech_ids: z.array(z.number().optional()),
});

const vehicleSchema = z.object({
  id: z.number(),
  year: z.string(),
  make: z.string(),
  model: z.string(),
  plate: z.string(),
  name: z.string(),
  type: z.string(),
  vin: z.string(),
  engine: z.string(),
  fleet_number: z.string().nullable(),
  color: z.string(),
  registration_exp_date: z.string().nullable(),
  production_date: z.string().nullable(),
});

const customerSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  contact_email: z.string(),
  detail: z.string(),
});

const statusSchema = z.object({
  id: z.number(),
  text: z.string(),
  row_order: z.number(),
  include_in_ro_quickview: z.boolean(),
});

const labelSchema = z.object({
  id: z.number(),
  text: z.string(),
  tenant_id: z.number(),
  row_order: z.number(),
  color_code: z.string().nullable(),
  active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const advisorSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  contact_email: z.string(),
  detail: z.any().nullable(),
});

const transferSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  contact_email: z.string(),
  detail: z.any().nullable(),
  short_name: z.string(),
  active: z.boolean(),
  assigned_shop_id: z.number(),
});

const currentAssignmentSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  accepted_at: z.string().nullable(),
  transfer_to: transferSchema,
  transfer_from: transferSchema.nullable(),
  message: z.string().nullable(),
  expeditor_datetime: z.string(),
  expeditor_datetime_iso: z.string(),
  row_order: z.number(),
});

const terminalSchema = z.object({
  id: z.number(),
  name: z.string(),
  serial_number: z.string(),
  shop_id: z.number(),
  tid: z.string(),
  type: z.string(),
});

const twilioAddressSchema = z.object({
  id: z.number(),
  tenant_id: z.number(),
  contact_type: z.string(),
  contact_id: z.number(),
  country_code: z.string(),
  zip: z.string(),
  state: z.string(),
  city: z.string(),
  address: z.string(),
  address_parts: z.any().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const gpThresholdsSettingSchema = z.object({
  id: z.number(),
  shop_id: z.number(),
  total_gp_bh_threshold: z.any().nullable(),
  labor_gp_threshold: z.string(),
  parts_gp_threshold: z.string(),
  sublet_gp_threshold: z.any().nullable(),
  is_optimizer_parts_gp_threshold: z.boolean(),
});

const shopRoSettingsSchema = z.object({
  advisor_req_to_close: z.boolean(),
  label_req_to_start: z.boolean(),
  label_req_to_close: z.boolean(),
  odometer_in_req_to_start: z.boolean(),
  odometer_out_req_to_close: z.boolean(),
  address_req_to_start: z.boolean(),
  address_req_to_close: z.boolean(),
  phone_req_to_start: z.boolean(),
  phone_req_to_close: z.boolean(),
  email_req_to_start: z.boolean(),
  email_req_to_close: z.boolean(),
  source_req_to_start: z.boolean(),
  reason_req_to_start: z.boolean(),
  year_req_to_start: z.boolean(),
  year_req_to_close: z.boolean(),
  model_req_to_start: z.boolean(),
  model_req_to_close: z.boolean(),
  vin_req_to_start: z.boolean(),
  vin_req_to_close: z.boolean(),
  plate_req_to_start: z.boolean(),
  plate_req_to_close: z.boolean(),
  technician_req_to_close: z.boolean(),
  make_req_to_start: z.boolean(),
  make_req_to_close: z.boolean(),
  global_settings_field_names: z.array(z.string()),
});

const payments360RemoteForceCredentialSchema = z.object({
  id: z.number(),
});

const shopSchema = z.object({
  id: z.number(),
  name: z.string(),
  identifier: z.string(),
  service_desk_email: z.string(),
  time_zone: z.string(),
  tos: z.string(),
  labor_tax_rate: z.string(),
  part_tax_rate: z.string(),
  hazmat_tax_rate: z.string(),
  sublet_tax_rate: z.string(),
  avg_labor_cost_cents: z.number(),
  tbo_location_id: z.string(),
  logo_file_name: z.string(),
  logo_content_type: z.string(),
  logo_file_size: z.number(),
  logo_updated_at: z.string(),
  service_desk_email_cc: z.boolean(),
  bosch_program: z.string(),
  supply_fee_rate: z.string(),
  part_supply_fee_rate: z.string(),
  supply_fee_name: z.string(),
  supply_fee_cap: z.string(),
  is_gp_enabled: z.boolean(),
  phone: z.string(),
  mycarfax_enabled: z.boolean(),
  mycarfax_contact_address: z.string(),
  mycarfax_contact_city: z.string(),
  mycarfax_contact_state: z.string(),
  mycarfax_contact_phone: z.string(),
  mycarfax_contact_name: z.string(),
  mycarfax_contact_email: z.string(),
  mycarfax_contact_zip: z.string(),
  mycarfax_activation_date: z.string(),
  plate_decode_default_state: z.string(),
  tos_print_req: z.boolean(),
  texting_enabled: z.boolean(),
  invoices_sync_on_pick_up: z.boolean(),
  optimizer_price_only: z.boolean(),
  shop_state: z.string(),
  book_time_multiplier: z.string(),
  card_connect_mid: z.any().nullable(),
  terminals: z.array(terminalSchema),
  payment_360_enabled: z.boolean(),
  payment_360_business_name: z.string(),
  payment_360_contact_address: z.string(),
  payment_360_contact_city: z.string(),
  payment_360_contact_state: z.string(),
  payment_360_contact_zip: z.string(),
  payment_360_contact_phone: z.string(),
  payment_360_contact_name: z.string(),
  payment_360_contact_email: z.string(),
  payment_360_activation_date: z.string(),
  time_zone_js: z.string(),
  odometer_in_req: z.boolean(),
  odometer_out_req: z.boolean(),
  brand_req: z.boolean(),
  description_req: z.boolean(),
  part_number_req: z.boolean(),
  vendor_req: z.boolean(),
  cost_req: z.boolean(),
  list_req: z.boolean(),
  optimizer_group_price_enabled: z.boolean(),
  require_part_fulfillment_to_close_ro: z.boolean(),
  payment_360_remote_enabled: z.boolean(),
  partstech_catalogue_enabled: z.boolean(),
  email_if_job_started: z.boolean(),
  email_if_payment_taken: z.boolean(),
  mitchell_enabled: z.boolean(),
  omie_connected: z.boolean(),
  a2p10dlc_registration_status: z.string(),
  country_code: z.string(),
  twilio_contact_first_name: z.string(),
  twilio_contact_last_name: z.string(),
  twilio_contact_email: z.string(),
  twilio_address: twilioAddressSchema,
  website_url: z.string(),
  business_type: z.string(),
  business_registration_number: z.string(),
  twilio_contact_job_position: z.string(),
  twilio_contact_business_title: z.string(),
  company_type: z.string(),
  stock_exchange: z.any().nullable(),
  stock_ticker: z.string(),
  manager_signature_url: z.any().nullable(),
  channel_name: z.string(),
  identifix_direct_hit_connected: z.boolean(),
  labor_discount_percentage: z.string(),
  parts_discount_percentage: z.string(),
  business_legal_name: z.string(),
  gender_enabled: z.boolean(),
  is_gp_configured: z.boolean(),
  signature_required: z.boolean(),
  supply_fees_taxable: z.boolean(),
  gp_thresholds_setting: gpThresholdsSettingSchema,
  shop_ro_settings: shopRoSettingsSchema,
  payments360_remote_force_credential: payments360RemoteForceCredentialSchema,
});

const technicianSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string(),
  contact_email: z.string(),
});

const workOrderSchema = z.object({
  assignment_accepted: z.boolean(),
  service_statuses: z.array(serviceStatusSchema),
  active_techs: z.array(z.any()),
  labors_total_hours: z.string(),
  completed_labors_total_hours: z.string(),
  id: z.number(),
  date: z.string(),
  datetime: z.string(),
  title: z.string(),
  full_title: z.string(),
  detail: z.any().nullable(),
  state: z.enum(["estimate", "in_progress", "invoice"]),
  number: z.number(),
  preferred_contact_type: z.string(),
  due_in_at: z.string().nullable(),
  due_out_at: z.string().nullable(),
  display_title: z.string(),
  show_path: z.string(),
  parts_are_needed: z.boolean(),
  parts_are_ordered: z.boolean(),
  parts_are_in_progress: z.boolean(),
  involved_staff: z.array(z.number()),
  involved_technicians: z.array(z.number()),
  status_id: z.number().nullable(),
  vehicle: vehicleSchema,
  customer: customerSchema,
  status: statusSchema.nullable(),
  label: labelSchema,
  advisor: advisorSchema,
  technician: technicianSchema.nullable(),
  current_assignment: currentAssignmentSchema,
  shop: shopSchema,
});

export const workOrdersSchema = z.array(workOrderSchema);

export type WorkOrder = z.infer<typeof workOrderSchema>;
type Result =
  | { data: WorkOrder[]; error: null }
  | { error: string; data: null };

const makeCookieString = (shopWareToken: string) => {
  return `_cookie_remember_token=${shopWareToken};`;
};

export const getWorkOrders = async ({
  shopWareToken,
  shopWareApiUrl,
}: {
  shopWareToken: string;
  shopWareApiUrl: string;
}): Promise<Result> => {
  try {
    const res = await fetch(`${shopWareApiUrl}/work_orders.json?filter=open`, {
      method: "GET",
      headers: {
        Cookie: makeCookieString(shopWareToken),
      },
    });

    if (!res.ok) {
      return { error: "Failed to fetch work orders", data: null };
    }

    const body = await res.json();
    const parsedBody = workOrdersSchema.parse(body);

    return { data: parsedBody, error: null };
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return { error: "Failed to fetch work orders error: " + error, data: null };
  }
};
