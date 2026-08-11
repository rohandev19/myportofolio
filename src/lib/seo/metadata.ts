import { Metadata } from "next";

export function constructMetadata({
  title = "Rohan - Portofolio",
  description = "Portfolio of Rohan, a Junior Full-Stack Engineer specializing in scalable systems, mobile apps, and interactive web experiences.",
  image = "/og-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@rohandev19",
    },
    icons,
    metadataBase: new URL("https://rohandev19.github.io"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
