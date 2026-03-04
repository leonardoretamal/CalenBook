import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mtozziuwrvhoksrloexn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b3p6aXV3cnZob2tzcmxvZXhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2MDY0MiwiZXhwIjoyMDg4MTM2NjQyfQ.L7dJTsaeuSU3AKMeZi31La0pUMBvxO8Yvk5bd4rm7f8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOwners() {
  const { data, error } = await supabase.from("owners").select("*");
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Owners:", JSON.stringify(data, null, 2));
}

checkOwners();
