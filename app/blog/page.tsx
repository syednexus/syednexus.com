import NexusBlogs from "@/components/blogs/NexusBlogs";
import BackToGlobe from "@/components/gateway/BackToGlobe";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <div className="mx-auto max-w-6xl px-6 pb-6">
        <BackToGlobe />
      </div>
      <NexusBlogs />
    </main>
  );
}
