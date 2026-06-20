import NexusOSProviders from "@/components/os/NexusOSProviders";

export default function NexusOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NexusOSProviders>{children}</NexusOSProviders>;
}
