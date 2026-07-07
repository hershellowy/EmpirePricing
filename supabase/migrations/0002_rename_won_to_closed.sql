-- Rename the 'Won' stage to 'Closed' and reorder the pipeline to:
-- Targeting -> Pending Pricing -> Pending Proposal -> Submitted -> Closed -> Executed -> Lost
--
-- Renaming (rather than dropping/recreating the enum) preserves any buildings
-- and stage_logs rows already sitting in this stage — they read as 'Closed'
-- immediately after this runs. Display order is controlled by the app's
-- STAGES constant, not the enum's internal order, so no reordering is needed
-- here.
alter type public.building_stage rename value 'Won' to 'Closed';
