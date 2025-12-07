// בתוך update-product-image.dto.ts (תיקון שמות לשמות הנכסים ב-Entity):

export class UpdateProductImageDto {
  readonly imageUrl?: string;    // במקום image_url
  readonly sortOrder?: number;  // במקום sort_order
  // אסור לכלול כאן שדות מפתח זר אם הם אינם ניתנים לעדכון.
}