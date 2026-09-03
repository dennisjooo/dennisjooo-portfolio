import { ImageResponse } from "next/og";
import { findBlogBySlug, visibleBlogsFilter } from "@/lib/data/blogs";
import { getSiteHostname, SITE_NAME } from "@/lib/constants/site";
import { loadOgFonts } from "@/lib/og/caslonFont";
import {
  OG_SIZE,
  OgBackground,
  OgCaslonTitle,
  OgDivider,
  OgMonoLabel,
} from "@/lib/og/createOgImage";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const fonts = await loadOgFonts();
  const { slug } = await params;
  const blog = await findBlogBySlug(slug, visibleBlogsFilter());

  if (!blog) {
    return new ImageResponse(
      <OgBackground>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <OgCaslonTitle fontSize={56}>Not Found</OgCaslonTitle>
          <div
            style={{
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              color: "#a3a3a3",
              marginTop: 16,
            }}
          >
            {SITE_NAME}
          </div>
        </div>
      </OgBackground>,
      { ...size, fonts },
    );
  }

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const titleFontSize =
    blog.title.length > 60 ? 44 : blog.title.length > 40 ? 52 : 64;

  return new ImageResponse(
    <OgBackground backgroundImage={blog.imageUrl}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "60px 72px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <OgMonoLabel>{blog.type}</OgMonoLabel>
          <OgMonoLabel>{formattedDate}</OgMonoLabel>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: "100%",
          }}
        >
          <OgDivider width={48} />
          <OgCaslonTitle fontSize={titleFontSize}>{blog.title}</OgCaslonTitle>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              color: "#a3a3a3",
              letterSpacing: "0.04em",
            }}
          >
            {SITE_NAME}
          </div>
          <OgMonoLabel>{getSiteHostname()}</OgMonoLabel>
        </div>
      </div>
    </OgBackground>,
    { ...size, fonts },
  );
}
