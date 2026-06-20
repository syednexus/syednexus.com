import NexusOSProviders from "@/components/os/NexusOSProviders";

export default function NexusCommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NexusOSProviders>{children}</NexusOSProviders>;
}
