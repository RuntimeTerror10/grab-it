import { supabase } from "../../utils/supabaseClient";

export default function handler(req, res) {
  console.log(req.body);
  supabase.auth.api.setAuthCookie(req, res);
}
