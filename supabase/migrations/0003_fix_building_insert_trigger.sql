-- Fixes a bug in 0001_init.sql: on_building_insert ran BEFORE INSERT, but its
-- body inserts a stage_logs row referencing the new building's id. Since a
-- BEFORE INSERT trigger fires before the buildings row is physically written,
-- that insert violated stage_logs' foreign key to buildings on every single
-- attempt — no new building could ever be saved.
--
-- Re-create the trigger to run AFTER INSERT instead, once the parent row
-- exists.
drop trigger if exists on_building_insert on public.buildings;

create trigger on_building_insert
  after insert on public.buildings
  for each row execute function public.handle_building_stage_change();
