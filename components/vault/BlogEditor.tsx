"use client";

import { useEffect, useState } from "react";

type Blog = {
  id?: number;
  title: string;
  category: string;
  content: string;
  tags: string;
};

export default function BlogEditor() {
  const empty: Blog = {
    title: "",
    category: "Learning Notes",
    content: "",
    tags: ""
  };

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState<Blog>(empty);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setStatus("Saving...");

    const res = await fetch("/api/blogs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setStatus("BLOG SAVED");
      setForm(empty);
      load();
      return;
    }

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setStatus(data.error ?? "SAVE FAILED");
  }

  async function remove(id: number | undefined) {
    if (id == null) return;

    setStatus("Deleting...");

    const res = await fetch("/api/blogs", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      setStatus("BLOG DELETED");
      if (form.id === id) setForm(empty);
      load();
      return;
    }

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setStatus(data.error ?? "DELETE FAILED");
  }

  return (
    <div className="mt-10">
      <div className="space-y-5 rounded-xl border border-green-800 p-6">
        <input
          placeholder="Title"
          value={form.title}
          onChange={event => setForm({ ...form, title: event.target.value })}
          className="w-full border border-green-800 bg-black p-3"
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={event => setForm({ ...form, category: event.target.value })}
          className="w-full border border-green-800 bg-black p-3"
        />

        <textarea
          placeholder="Blog Content"
          value={form.content}
          onChange={event => setForm({ ...form, content: event.target.value })}
          className="h-60 w-full border border-green-800 bg-black p-3"
        />

        <input
          placeholder="Tags"
          value={form.tags}
          onChange={event => setForm({ ...form, tags: event.target.value })}
          className="w-full border border-green-800 bg-black p-3"
        />

        <button
          type="button"
          onClick={save}
          className="border border-green-600 px-6 py-3 hover:bg-green-950"
        >
          SAVE BLOG
        </button>

        <p>{status}</p>
      </div>

      <div className="mt-10 space-y-5">
        {blogs.map(blog => (
          <div key={blog.id} className="rounded-xl border border-green-900 p-5">
            <p className="text-gray-500">{blog.category}</p>
            <h2 className="text-xl">{blog.title}</h2>
            <p className="mt-3 text-sm text-gray-400">{blog.tags}</p>

            <div className="mt-5 flex gap-5">
              <button type="button" onClick={() => setForm(blog)}>
                EDIT
              </button>
              <button type="button" onClick={() => remove(blog.id)}>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
