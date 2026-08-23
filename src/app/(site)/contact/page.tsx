import { Card } from "@/components/ui/card";
import { WriteUsForm } from "@/components/contact/write-us-form";
import { getSiteSettings } from "@/db/queries/site";

export const metadata = {
  title: "Contact — CECECO",
  description: "We are here to answer your questions and explore opportunities for collaboration.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <section className="scheme-2 px-[5%] py-20 md:py-24 lg:py-28">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <h1 className="text-h1 font-bold">Contact Us</h1>
            <p className="mt-3 text-medium text-neutral">
              We are here to answer your questions and explore opportunities for collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="p-6 md:p-8">
              <h2 className="mb-6 text-h4 font-bold">Contact Information</h2>
              <div className="flex flex-col gap-5">
                {settings?.contactEmail && (
                  <ContactRow label="Email Address">
                    <a href={`mailto:${settings.contactEmail}`} className="text-mountain-meadow-dark hover:underline">
                      {settings.contactEmail}
                    </a>
                  </ContactRow>
                )}
                {settings?.contactPhone && <ContactRow label="Phone Number">{settings.contactPhone}</ContactRow>}
                {settings?.contactAddress && <ContactRow label="Address">{settings.contactAddress}</ContactRow>}
                {settings?.contactWorkingHours && (
                  <ContactRow label="Working Hours">{settings.contactWorkingHours}</ContactRow>
                )}
              </div>
              {settings?.contactMapEmbedUrl && (
                <div className="mt-6">
                  <h3 className="mb-3 text-small font-semibold text-scheme-text">Our Location</h3>
                  <iframe
                    src={settings.contactMapEmbedUrl}
                    title="Our Location"
                    className="h-64 w-full rounded-image border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="mb-6 text-h4 font-bold">Write Us</h2>
              <WriteUsForm />
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-small font-semibold text-scheme-text">{label}</p>
      <p className="mt-0.5 text-small text-neutral">{children}</p>
    </div>
  );
}
