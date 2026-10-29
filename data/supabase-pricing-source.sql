-- Satu sumber harga publik AClean: public.price_list.
-- Jalankan sebagai migration di project apsbeppcmsxeldnejibz.

-- Baris umum lama ini bertabrakan dengan tarif Floor Standing rinci per kapasitas.
update public.price_list
set is_active = false,
    updated_at = now(),
    updated_by = 'website-pricing-audit'
where service = 'Cleaning'
  and type = 'AC Standing'
  and price = 100000
  and is_active = true;

create or replace function public.get_website_pricing()
returns jsonb
language sql
stable
security definer
set search_path = 'public', 'pg_catalog'
as $function$
  select jsonb_build_object(
    'cuci_split_kecil',       (select price from public.price_list where service='Cleaning' and type='AC Split 0.5-1PK' and is_active=true limit 1),
    'cuci_split_besar',       (select price from public.price_list where service='Cleaning' and type='AC Split 1.5-2.5PK' and is_active=true limit 1),
    'cuci_cassette_kecil',    (select price from public.price_list where service='Cleaning' and type='AC Cassette 2-2.5PK' and is_active=true limit 1),
    'cuci_cassette_besar',    (select price from public.price_list where service='Cleaning' and type='AC Cassette 3PK' and is_active=true limit 1),
    'cuci_cassette_4',        (select price from public.price_list where service='Cleaning' and type='AC Cassette 4PK' and is_active=true limit 1),
    'cuci_cassette_5',        (select price from public.price_list where service='Cleaning' and type='AC Cassette 5PK' and is_active=true limit 1),
    'cuci_cassette_6',        (select price from public.price_list where service='Cleaning' and type='AC Cassette 6PK' and is_active=true limit 1),
    'cuci_duct_16',           (select price from public.price_list where service='Cleaning' and type='AC Split Duct 1,6PK' and is_active=true limit 1),
    'cuci_duct_2',            (select price from public.price_list where service='Cleaning' and type='AC Split Duct 2PK' and is_active=true limit 1),
    'cuci_duct_25',           (select price from public.price_list where service='Cleaning' and type='AC Split Duct 2.5PK' and is_active=true limit 1),
    'cuci_duct_3',            (select price from public.price_list where service='Cleaning' and type='AC Split Duct 3PK' and is_active=true limit 1),
    'cuci_duct_35',           (select price from public.price_list where service='Cleaning' and type='AC Split Duct 3.5PK' and is_active=true limit 1),
    'cuci_duct_4',            (select price from public.price_list where service='Cleaning' and type='AC Split Duct 4PK' and is_active=true limit 1),
    'cuci_duct_5',            (select price from public.price_list where service='Cleaning' and type='AC Split Duct 5PK' and is_active=true limit 1),
    'cuci_duct_6',            (select price from public.price_list where service='Cleaning' and type='AC Split Duct 6PK' and is_active=true limit 1),
    'cuci_floor_2',           (select price from public.price_list where service='Cleaning' and type='AC Floor Standing 2-2.5PK' and is_active=true limit 1),
    'cuci_floor_3',           (select price from public.price_list where service='Cleaning' and type='AC Floor Standing 3PK' and is_active=true limit 1),
    'cuci_floor_4',           (select price from public.price_list where service='Cleaning' and type='AC Floor Standing 4PK' and is_active=true limit 1),
    'cuci_floor_5',           (select price from public.price_list where service='Cleaning' and type='AC Floor Standing 5PK' and is_active=true limit 1),
    'freon_r32',              (select price from public.price_list where service='Repair' and type='Tambah Freon R-32' and is_active=true limit 1),
    'freon_r410a',            (select price from public.price_list where service='Repair' and type='Tambah Freon R-410A' and is_active=true limit 1),
    'freon_r22',              (select price from public.price_list where service='Repair' and type='Tambah Freon R-22' and is_active=true limit 1),
    'pasang_kecil',           (select price from public.price_list where service='Install' and type='Pemasangan AC Baru 0,5PK - 1PK' and is_active=true limit 1),
    'pasang_besar',           (select price from public.price_list where service='Install' and type='Pemasangan AC Baru 1,5PK - 2PK' and is_active=true limit 1),
    'pasang_apartemen',       (select price from public.price_list where service='Install' and type='Pemasangan AC Baru Apartemen' and is_active=true limit 1),
    'bongkar_pasang_indoor',  (select price from public.price_list where service='Install' and type='Jasa Bongkar Pasang Indoor' and is_active=true limit 1),
    'bongkar_pasang_outdoor', (select price from public.price_list where service='Install' and type='Jasa Bongkar Pasang Outdoor' and is_active=true limit 1),
    'bongkar_unit_kecil',     (select price from public.price_list where service='Install' and type='Jasa Bongkar Unit AC 0,5PK - 1PK' and is_active=true limit 1),
    'bongkar_unit_besar',     (select price from public.price_list where service='Install' and type='Jasa Bongkar Unit AC 1,5PK - 2,5PK' and is_active=true limit 1),
    'service_besar_kecil',    (select price from public.price_list where service='Cleaning' and type='Jasa Service Besar 0,5PK - 1PK' and is_active=true limit 1),
    'service_besar_besar',    (select price from public.price_list where service='Cleaning' and type='Jasa Service Besar 1,5PK - 2,5PK' and is_active=true limit 1),
    'pengecekan',             (select price from public.price_list where service='Repair' and type='Biaya Pengecekan AC' and is_active=true limit 1),
    'perbaikan_pcb',          (select price from public.price_list where service='Repair' and type='Jasa Perbaikan PCB/Elektrik' and is_active=true limit 1),
    'vacum_kecil',            (select price from public.price_list where service='Install' and type='Jasa Vacum AC 0,5PK - 2,5PK' and is_active=true limit 1),
    'vacum_besar',            (select price from public.price_list where service='Install' and type='Jasa Vacum Unit AC >3PK' and is_active=true limit 1),
    'pipa_1pk',               (select price from public.price_list where service='Material' and type='Pipa AC Hoda 1PK' and is_active=true limit 1),
    'pipa_2pk',               (select price from public.price_list where service='Material' and type='Pipa AC Hoda 2PK' and is_active=true limit 1),
    'pipa_2_5pk',             (select price from public.price_list where service='Material' and type='Pipa AC Hoda 2,5PK' and is_active=true limit 1),
    'pipa_3pk',               (select price from public.price_list where service='Material' and type='Pipa AC Hoda 3PK' and is_active=true limit 1),
    'kabel_15',               (select price from public.price_list where service='Material' and type='Kabel Listrik 3x1,5' and is_active=true limit 1),
    'kabel_25',               (select price from public.price_list where service='Material' and type='Kabel Listrik 3x2,5' and is_active=true limit 1),
    'duct_tape',              (select price from public.price_list where service='Material' and type='Duct Tape Lem' and is_active=true limit 1),
    'breket_outdoor',         (select price from public.price_list where service='Material' and type='Breket Outdoor Inc Dinabolt' and is_active=true limit 1),
    'instalasi_pipa',         (select price from public.price_list where service='Install' and type='Jasa Instalasi Pipa AC' and is_active=true limit 1),
    'duct_tape_non_lem',      (select price from public.price_list where service='Material' and type='Duct Tape Non Lem' and is_active=true limit 1),
    'selang_flexibel',        (select price from public.price_list where service='Material' and type='Selang Flexibel Drain' and is_active=true limit 1),
    'armaflex',               (select price from public.price_list where service='Material' and type='Armaplex' and is_active=true limit 1),
    'insulasi_paralon',       (select price from public.price_list where service='Material' and type='Insulasi Paralon' and is_active=true limit 1),
    'kuras_vacum',            (select price from public.price_list where service='Repair' and type='Kuras Vacum Freon R22' and is_active=true limit 1)
  );
$function$;

-- Harga boleh dibaca oleh website publik, tetapi tidak dapat diubah oleh anon.
revoke all on function public.get_website_pricing() from public;
grant execute on function public.get_website_pricing() to anon, authenticated;

create or replace function public.admin_save_website_prices(p_prices jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_key text;
  v_text text;
  v_price numeric;
  v_service text;
  v_type text;
  v_rows integer;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  if p_prices is null or jsonb_typeof(p_prices) <> 'object' then
    raise exception 'Payload harga harus berupa object JSON' using errcode = '22023';
  end if;

  for v_key, v_text in select key, value from jsonb_each_text(p_prices)
  loop
    begin
      v_price := v_text::numeric;
    exception when others then
      raise exception 'Harga untuk % bukan angka', v_key using errcode = '22023';
    end;
    if v_price < 0 or v_price > 100000000 or v_price <> trunc(v_price) then
      raise exception 'Harga untuk % tidak valid', v_key using errcode = '22023';
    end if;

    select m.service, m.type into v_service, v_type
    from (values
      ('cuci_split_kecil','Cleaning','AC Split 0.5-1PK'),
      ('cuci_split_besar','Cleaning','AC Split 1.5-2.5PK'),
      ('service_besar_kecil','Cleaning','Jasa Service Besar 0,5PK - 1PK'),
      ('service_besar_besar','Cleaning','Jasa Service Besar 1,5PK - 2,5PK'),
      ('cuci_duct_16','Cleaning','AC Split Duct 1,6PK'),
      ('cuci_duct_2','Cleaning','AC Split Duct 2PK'),
      ('cuci_duct_25','Cleaning','AC Split Duct 2.5PK'),
      ('cuci_duct_3','Cleaning','AC Split Duct 3PK'),
      ('cuci_duct_35','Cleaning','AC Split Duct 3.5PK'),
      ('cuci_duct_4','Cleaning','AC Split Duct 4PK'),
      ('cuci_duct_5','Cleaning','AC Split Duct 5PK'),
      ('cuci_duct_6','Cleaning','AC Split Duct 6PK'),
      ('pengecekan','Repair','Biaya Pengecekan AC'),
      ('perbaikan_pcb','Repair','Jasa Perbaikan PCB/Elektrik'),
      ('pasang_kecil','Install','Pemasangan AC Baru 0,5PK - 1PK'),
      ('pasang_besar','Install','Pemasangan AC Baru 1,5PK - 2PK'),
      ('pasang_apartemen','Install','Pemasangan AC Baru Apartemen'),
      ('bongkar_pasang_outdoor','Install','Jasa Bongkar Pasang Outdoor'),
      ('bongkar_pasang_indoor','Install','Jasa Bongkar Pasang Indoor'),
      ('bongkar_unit_kecil','Install','Jasa Bongkar Unit AC 0,5PK - 1PK'),
      ('bongkar_unit_besar','Install','Jasa Bongkar Unit AC 1,5PK - 2,5PK'),
      ('vacum_kecil','Install','Jasa Vacum AC 0,5PK - 2,5PK'),
      ('freon_r22','Repair','Tambah Freon R-22'),
      ('freon_r32','Repair','Tambah Freon R-32'),
      ('freon_r410a','Repair','Tambah Freon R-410A'),
      ('kuras_vacum','Repair','Kuras Vacum Freon R22')
    ) as m(key, service, type)
    where m.key = v_key;

    if v_service is null then
      raise exception 'Key harga tidak dikenal: %', v_key using errcode = '22023';
    end if;

    update public.price_list
       set price = v_price
     where service = v_service and type = v_type and is_active = true;
    get diagnostics v_rows = row_count;
    if v_rows <> 1 then
      raise exception 'Baris price_list aktif untuk % berjumlah %, seharusnya 1', v_key, v_rows using errcode = 'P0001';
    end if;
  end loop;

  return public.get_website_pricing();
end;
$function$;

revoke all on function public.admin_save_website_prices(jsonb) from public, anon;
grant execute on function public.admin_save_website_prices(jsonb) to authenticated;
