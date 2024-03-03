create table "public"."diary" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "title" character varying,
    "transcription" text,
    "video_path" text not null,
    "video_type" character varying not null,
    "thumbnail_path" text
);


alter table "public"."diary" enable row level security;

create table "public"."diary_tag" (
    "diary_id" uuid not null,
    "tag_id" uuid not null,
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."diary_tag" enable row level security;

create table "public"."profile" (
    "user_id" uuid not null default auth.uid(),
    "first_name" text not null,
    "last_name" text not null
);


alter table "public"."profile" enable row level security;

create table "public"."tag" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid(),
    "name" text not null
);


alter table "public"."tag" enable row level security;

CREATE UNIQUE INDEX diary_pkey ON public.diary USING btree (id);

CREATE UNIQUE INDEX diary_tag_pkey ON public.diary_tag USING btree (diary_id, tag_id);

CREATE UNIQUE INDEX diary_thumbnail_path_key ON public.diary USING btree (thumbnail_path);

CREATE UNIQUE INDEX diary_video_name_key ON public.diary USING btree (video_path);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (user_id);

CREATE UNIQUE INDEX tag_pkey ON public.tag USING btree (id);

CREATE UNIQUE INDEX unique_tag ON public.tag USING btree (user_id, name);

alter table "public"."diary" add constraint "diary_pkey" PRIMARY KEY using index "diary_pkey";

alter table "public"."diary_tag" add constraint "diary_tag_pkey" PRIMARY KEY using index "diary_tag_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."tag" add constraint "tag_pkey" PRIMARY KEY using index "tag_pkey";

alter table "public"."diary" add constraint "diary_thumbnail_path_key" UNIQUE using index "diary_thumbnail_path_key";

alter table "public"."diary" add constraint "diary_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."diary" validate constraint "diary_user_id_fkey";

alter table "public"."diary" add constraint "diary_video_name_key" UNIQUE using index "diary_video_name_key";

alter table "public"."diary_tag" add constraint "diary_tag_diary_id_fkey" FOREIGN KEY (diary_id) REFERENCES diary(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."diary_tag" validate constraint "diary_tag_diary_id_fkey";

alter table "public"."diary_tag" add constraint "diary_tag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tag(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."diary_tag" validate constraint "diary_tag_tag_id_fkey";

alter table "public"."diary_tag" add constraint "diary_tag_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."diary_tag" validate constraint "diary_tag_user_id_fkey";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

alter table "public"."tag" add constraint "tag_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tag" validate constraint "tag_user_id_fkey";

alter table "public"."tag" add constraint "unique_tag" UNIQUE using index "unique_tag";

grant delete on table "public"."diary" to "anon";

grant insert on table "public"."diary" to "anon";

grant references on table "public"."diary" to "anon";

grant select on table "public"."diary" to "anon";

grant trigger on table "public"."diary" to "anon";

grant truncate on table "public"."diary" to "anon";

grant update on table "public"."diary" to "anon";

grant delete on table "public"."diary" to "authenticated";

grant insert on table "public"."diary" to "authenticated";

grant references on table "public"."diary" to "authenticated";

grant select on table "public"."diary" to "authenticated";

grant trigger on table "public"."diary" to "authenticated";

grant truncate on table "public"."diary" to "authenticated";

grant update on table "public"."diary" to "authenticated";

grant delete on table "public"."diary" to "service_role";

grant insert on table "public"."diary" to "service_role";

grant references on table "public"."diary" to "service_role";

grant select on table "public"."diary" to "service_role";

grant trigger on table "public"."diary" to "service_role";

grant truncate on table "public"."diary" to "service_role";

grant update on table "public"."diary" to "service_role";

grant delete on table "public"."diary_tag" to "anon";

grant insert on table "public"."diary_tag" to "anon";

grant references on table "public"."diary_tag" to "anon";

grant select on table "public"."diary_tag" to "anon";

grant trigger on table "public"."diary_tag" to "anon";

grant truncate on table "public"."diary_tag" to "anon";

grant update on table "public"."diary_tag" to "anon";

grant delete on table "public"."diary_tag" to "authenticated";

grant insert on table "public"."diary_tag" to "authenticated";

grant references on table "public"."diary_tag" to "authenticated";

grant select on table "public"."diary_tag" to "authenticated";

grant trigger on table "public"."diary_tag" to "authenticated";

grant truncate on table "public"."diary_tag" to "authenticated";

grant update on table "public"."diary_tag" to "authenticated";

grant delete on table "public"."diary_tag" to "service_role";

grant insert on table "public"."diary_tag" to "service_role";

grant references on table "public"."diary_tag" to "service_role";

grant select on table "public"."diary_tag" to "service_role";

grant trigger on table "public"."diary_tag" to "service_role";

grant truncate on table "public"."diary_tag" to "service_role";

grant update on table "public"."diary_tag" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."tag" to "anon";

grant insert on table "public"."tag" to "anon";

grant references on table "public"."tag" to "anon";

grant select on table "public"."tag" to "anon";

grant trigger on table "public"."tag" to "anon";

grant truncate on table "public"."tag" to "anon";

grant update on table "public"."tag" to "anon";

grant delete on table "public"."tag" to "authenticated";

grant insert on table "public"."tag" to "authenticated";

grant references on table "public"."tag" to "authenticated";

grant select on table "public"."tag" to "authenticated";

grant trigger on table "public"."tag" to "authenticated";

grant truncate on table "public"."tag" to "authenticated";

grant update on table "public"."tag" to "authenticated";

grant delete on table "public"."tag" to "service_role";

grant insert on table "public"."tag" to "service_role";

grant references on table "public"."tag" to "service_role";

grant select on table "public"."tag" to "service_role";

grant trigger on table "public"."tag" to "service_role";

grant truncate on table "public"."tag" to "service_role";

grant update on table "public"."tag" to "service_role";

create policy "Enable access for users based on user_id"
on "public"."diary"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable access for users based on user_id"
on "public"."diary_tag"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable access for users based on user_id"
on "public"."profile"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable access for users based on user_id"
on "public"."tag"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



create policy "Give users access to own folder 1uswaj_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'video'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1uswaj_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'video'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1uswaj_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'video'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder m05xik_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'thumbnail'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder m05xik_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'thumbnail'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder m05xik_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'thumbnail'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



