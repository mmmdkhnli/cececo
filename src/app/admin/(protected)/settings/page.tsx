import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage() {
  const [settings] = await db.select().from(siteSettings).limit(1);

  return (
    <div>
      <h1 className="text-h3 font-bold text-neutral-darkest">Site settings</h1>
      <p className="mt-1 text-medium text-neutral">Logo and footer text.</p>

      {settings && (
        <form action={updateSiteSettings.bind(null, settings.id)} className="mt-8 flex max-w-xl flex-col gap-5">
          <ImageUpload name="logoLight" defaultValue={settings.logoLight} label="Logo (for light background)" />
          <ImageUpload name="logoDark" defaultValue={settings.logoDark} label="Logo (for dark background)" />
          <div className="flex flex-col gap-1.5">
            <label className="text-small font-semibold text-neutral-darkest">Footer description</label>
            <textarea
              name="footerDescription"
              defaultValue={settings.footerDescription}
              rows={3}
              className="admin-input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-small font-semibold text-neutral-darkest">Copyright text</label>
            <input name="copyrightText" defaultValue={settings.copyrightText} className="admin-input" />
          </div>

          <div className="mt-2 flex flex-col gap-5 rounded-card border border-neutral-lighter p-4">
            <p className="text-small font-semibold text-neutral-darkest">
              Contact page — Contact information
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-darkest">Email</label>
              <input name="contactEmail" defaultValue={settings.contactEmail ?? ""} className="admin-input" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-darkest">Phone</label>
              <input name="contactPhone" defaultValue={settings.contactPhone ?? ""} className="admin-input" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-darkest">Address</label>
              <input name="contactAddress" defaultValue={settings.contactAddress ?? ""} className="admin-input" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-darkest">Working hours</label>
              <input
                name="contactWorkingHours"
                defaultValue={settings.contactWorkingHours ?? ""}
                className="admin-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-darkest">Google Maps embed URL</label>
              <input
                name="contactMapEmbedUrl"
                defaultValue={settings.contactMapEmbedUrl ?? ""}
                className="admin-input"
              />
              <p className="text-tiny text-neutral">
                Must be an <strong>embed</strong> URL (contains <code>/maps/embed</code> or{" "}
                <code>output=embed</code>) — get it from Google Maps&apos;s &quot;Share&quot; dialog, the{" "}
                <strong>&quot;Embed a map&quot;</strong> tab (not the plain share link), and copy just the{" "}
                <code>src=&quot;...&quot;</code> value out of the HTML snippet it gives you. A plain share link
                (e.g. <code>maps.app.goo.gl/...</code>) will not work here — browsers block it from loading in
                an embedded frame.
              </p>
            </div>
          </div>

          <div className="mt-2">
            <SubmitButton>Save</SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}
