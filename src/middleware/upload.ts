export const uploadFile = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new Error("No file uploaded");
    }

    return file;
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};
