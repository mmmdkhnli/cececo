import { uploadImage, deleteImage } from "@/app/admin/upload-action";
import { FileUpload } from "@/components/admin/ui/file-upload";
import { FormField } from "@/components/admin/ui/form-field";

export function ImageUpload({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const body = (
    <FileUpload
      name={name}
      defaultValue={defaultValue}
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      uploadAction={uploadImage}
      deleteAction={deleteImage}
      preview="image"
    />
  );

  return label ? <FormField label={label}>{body}</FormField> : body;
}
