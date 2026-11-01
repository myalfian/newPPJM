import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Akses ditolak: Header otentikasi tidak ditemukan.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // 1. Verify caller with anon client bound to caller's JWT
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Akses ditolak: Sesi otentikasi tidak valid.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Strict Super Admin Check from admin_profiles
    const { data: callerProfile, error: profileErr } = await supabaseClient
      .from('admin_profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (profileErr || !callerProfile || callerProfile.role !== 'super_admin' || callerProfile.is_active === false) {
      return new Response(
        JSON.stringify({ error: 'Akses ditolak: Hanya Super Admin yang berhak menambahkan pengguna administrator.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse and sanitize payload
    const body = await req.json();
    const {
      email,
      password,
      full_name,
      role = 'user',
      nip,
      phone,
      bio,
      motto,
      avatar_url,
      class_grade
    } = body;

    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Mohon lengkapi email, kata sandi, dan nama lengkap.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Kata sandi minimal 8 karakter dengan kombinasi aman.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Create user with Service Role client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name.trim(),
        role: role,
      },
    });

    if (authError || !authUser.user) {
      return new Response(
        JSON.stringify({ error: authError?.message || 'Gagal membuat user di Supabase Auth.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newUserId = authUser.user.id;

    // 5. Insert profile into admin_profiles
    const { error: insertProfileError } = await supabaseAdmin
      .from('admin_profiles')
      .insert({
        id: newUserId,
        email: email.trim().toLowerCase(),
        full_name: full_name.trim(),
        role: role,
        nip: nip || null,
        phone: phone || null,
        bio: bio || null,
        motto: motto || null,
        avatar_url: avatar_url || null,
        class: class_grade || null,
        is_active: true,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertProfileError) {
      // Rollback: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return new Response(
        JSON.stringify({ error: `Gagal membuat profil: ${insertProfileError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Record Audit Log
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      email: user.email,
      role: 'super_admin',
      action: 'create_user',
      module: 'users',
      section_id: newUserId,
      new_data: {
        email: email.trim().toLowerCase(),
        full_name: full_name.trim(),
        role: role,
        created_by: user.id,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUserId,
          email: email.trim().toLowerCase(),
          full_name: full_name.trim(),
          role: role,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Terjadi kesalahan internal server.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

