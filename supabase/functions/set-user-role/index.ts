// Supabase Edge Function：設定使用者角色
// 使用 SERVICE_ROLE_KEY 建立 Admin Client，僅供超級管理員呼叫

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { user_id, role } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    )

    // 更新使用者的 app_metadata 以設定角色
    const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      app_metadata: { role },
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
})
