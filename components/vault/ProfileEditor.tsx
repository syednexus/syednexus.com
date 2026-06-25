"use client";

import { useEffect, useState } from "react";

import { refreshAppData } from "@/lib/refreshAppData";
import { fetchIdentity, saveIdentity, type IdentityRecord } from "@/lib/identityApi";

type Identity = IdentityRecord;

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Identity>({
    name: "",
    headline: "",
    summary: "",
    location: "",
    avatar: "",
    email: "",
    linkedin: "",
    github: "",
    resume: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const result = await fetchIdentity();
      if (result.ok) {
        setProfile({
          name: result.data.name,
          headline: result.data.headline,
          summary: result.data.summary,
          location: result.data.location ?? "",
          avatar: result.data.avatar ?? "",
          email: result.data.email ?? "",
          linkedin: result.data.linkedin ?? "",
          github: result.data.github ?? "",
          resume: result.data.resume ?? ""
        });
      } else {
        setStatus(result.error);
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    setStatus("Saving...");

    const result = await saveIdentity(profile);
    if (!result.ok) {
      setStatus(result.error);
      return;
    }

    setProfile(result.data);
    setStatus("PROFILE UPDATED");
    refreshAppData();
  }

  function update(key: keyof Identity, value: string) {
    setProfile({
      ...profile,
      [key]: value
    });
  }

  if (loading) {
    return <p className="text-green-400">Loading profile...</p>;
  }

  return (
    <div
      className="
mt-10

border
border-green-800

rounded-xl

p-6

space-y-5
"
    >
      {Object.keys(profile).map(key => (
        <div key={key}>
          <p className="uppercase text-xs text-gray-500">{key}</p>
          <textarea
            value={profile[key as keyof Identity] || ""}
            onChange={e => update(key as keyof Identity, e.target.value)}
            className="
mt-2

w-full

bg-black

border
border-green-800

p-3

text-green-400

outline-none
"
          />
        </div>
      ))}

      <button
        onClick={() => {
          void save();
        }}
        className="
border
border-green-600

px-6
py-3

hover:bg-green-950
"
      >
        SAVE PROFILE
      </button>

      <p>{status}</p>
    </div>
  );
}
