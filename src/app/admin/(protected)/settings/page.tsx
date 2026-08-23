import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getSession } from "@/lib/session";
import { AccountForm } from "@/components/admin/account-form";
import { ImageUpload } from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { FormField } from "@/components/admin/ui/form-field";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([
    db.select().from(siteSettings).limit(1).then((rows) => rows[0]),
    getSession(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Site settings</h1>
        <p className="mt-1 text-muted-foreground">Logo and footer text.</p>
      </div>

      {settings && (
        <form action={updateSiteSettings.bind(null, settings.id)} className="flex max-w-xl flex-col gap-5">
          <ImageUpload name="logoLight" defaultValue={settings.logoLight} label="Logo (for light background)" />
          <ImageUpload name="logoDark" defaultValue={settings.logoDark} label="Logo (for dark background)" />
          <FormField label="Footer description">
            <Textarea name="footerDescription" defaultValue={settings.footerDescription} rows={3} />
          </FormField>
          <FormField label="Copyright text">
            <Input name="copyrightText" defaultValue={settings.copyrightText} />
          </FormField>

          <Card className="gap-4 p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-sm">Contact page — Contact information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0">
              <FormField label="Email">
                <Input name="contactEmail" defaultValue={settings.contactEmail ?? ""} />
              </FormField>
              <FormField label="Phone">
                <Input name="contactPhone" defaultValue={settings.contactPhone ?? ""} />
              </FormField>
              <FormField label="Address">
                <Input name="contactAddress" defaultValue={settings.contactAddress ?? ""} />
              </FormField>
              <FormField label="Working hours">
                <Input name="contactWorkingHours" defaultValue={settings.contactWorkingHours ?? ""} />
              </FormField>
              <FormField label="Google Maps embed URL">
                <Input name="contactMapEmbedUrl" defaultValue={settings.contactMapEmbedUrl ?? ""} />
                <p className="text-xs text-muted-foreground">
                  Must be an <strong>embed</strong> URL (contains <code>/maps/embed</code> or{" "}
                  <code>output=embed</code>) — get it from Google Maps&apos;s &quot;Share&quot; dialog, the{" "}
                  <strong>&quot;Embed a map&quot;</strong> tab (not the plain share link), and copy just the{" "}
                  <code>src=&quot;...&quot;</code> value out of the HTML snippet it gives you. A plain share link
                  (e.g. <code>maps.app.goo.gl/...</code>) will not work here — browsers block it from loading in
                  an embedded frame.
                </p>
              </FormField>
            </CardContent>
          </Card>

          <div>
            <SubmitButton>Save</SubmitButton>
          </div>
        </form>
      )}

      <AccountForm name={session.name ?? ""} email={session.email ?? ""} />
    </div>
  );
}
