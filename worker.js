/**
 * Cloudflare Worker Backend - High Performance Edition
 * Paste this into your Cloudflare Worker Dashboard.
 * Bind a KV Namespace named 'UNI_DATA' to this worker.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const isAdmin = request.headers.get("Authorization") === "Bearer admin123";

    try {
      if (url.pathname === "/api/data") {
        const [teachers, subjects, schedule, semesters] = await Promise.all([
          env.UNI_DATA.get("TEACHERS"),
          env.UNI_DATA.get("SUBJECTS"),
          env.UNI_DATA.get("SCHEDULE"),
          env.UNI_DATA.get("SEMESTERS")
        ]);

        return new Response(JSON.stringify({ 
          teachers: JSON.parse(teachers || "[]"), 
          subjects: JSON.parse(subjects || "[]"), 
          schedule: JSON.parse(schedule || "[]"),
          semesters: JSON.parse(semesters || "[{\"id\":\"sem_default\",\"label\":\"🌱 SPRING SEMESTER 2026 🌸\",\"isActive\":true}]"),
          lastUpdated: Date.now()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (url.pathname === "/api/update" && isAdmin) {
        if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
        
        const { key, data } = await request.json();
        const validKeys = ["TEACHERS", "SUBJECTS", "SCHEDULE", "SEMESTERS"];
        
        if (!validKeys.includes(key)) return new Response("Invalid Key", { status: 400, headers: corsHeaders });
        
        await env.UNI_DATA.put(key, JSON.stringify(data));
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};