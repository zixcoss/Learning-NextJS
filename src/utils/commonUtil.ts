export const productImageURL = (image?: string): string => {
    return `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL_API}/${image}`;
};