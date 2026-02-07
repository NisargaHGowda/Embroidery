import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

const UploadDesign = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const filePath = `design_pdfs/${Date.now()}_${file.name}`;

    setUploading(true);
    console.log("Starting upload:", file.name);

    try {
      // ✅ Upload PDF to Supabase Storage
      const { data, error } = await supabase.storage
        .from("design_pdfs")
        .upload(filePath, file);

      if (error) {
        console.error("PDF Upload Error:", error);
        alert("Failed to upload PDF. Check console for details.");
        setUploading(false);
        return;
      }

      console.log("Upload Success:", data);

      // ✅ Get Public URL Correctly
      const pdfUrl = supabase.storage.from("design_pdfs").getPublicUrl(filePath);

      console.log("PDF Public URL:", pdfUrl);

      // ✅ Save PDF URL to Database
      const { error: dbError } = await supabase.from("designs").insert([
        { name: "54 Embroidery Designs", price_range: "500-2000", pdf_url: pdfUrl },
      ]);

      if (dbError) {
        console.error("Database Insert Error:", dbError);
        alert("Failed to save design. Check console for details.");
      } else {
        alert("PDF uploaded successfully!");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("An unexpected error occurred.");
    }

    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upload Embroidery Design</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />
      {uploading && <p className="text-purple-600 mt-2">Uploading...</p>}
    </div>
  );
};

export default UploadDesign;
