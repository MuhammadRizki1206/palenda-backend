import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export const UploadService = {
  async uploadImage(file: File, fileName: string) {
    try {
      if (!(file instanceof File)) {
        throw new Error("Invalid file type. Expected File object.");
      }

      const uniqueFileName = `images/${Date.now()}_${fileName}`;

      const storage = supabase.storage.from("product");

      const { data, error } = await storage.upload(uniqueFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        throw new Error(error.message);
      }

      return storage.getPublicUrl(data.path);
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  },
};
