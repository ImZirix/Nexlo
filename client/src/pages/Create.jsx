import { useState } from "react";
import { Upload } from "lucide-react";
import api from "../utils/axios.js"; // Adjust path if needed
import { useNavigate } from "react-router";

function Create() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const formData = new FormData();
    formData.append("content", caption);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/"); // Redirect to homepage after post
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 min-h-screen text-white flex flex-col justify-center items-center px-6 py-12"
    >
      <h1 className="text-4xl font-bold mb-8">Create Post</h1>

      {/* Caption Textarea */}
      <textarea
        rows={8}
        placeholder="Write your caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full max-w-xl bg-gray-800 border border-gray-700 rounded-lg p-4 text-lg focus:outline-none focus:border-blue-500 resize-none mb-6"
      />

      {/* Upload & Submit Row */}
      <div className="flex items-center gap-4 flex-wrap">
        <label className="cursor-pointer inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-md">
          <Upload className="w-5 h-5" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-md font-medium"
        >
          Share
        </button>
      </div>
    </form>
  );
}

export default Create;
