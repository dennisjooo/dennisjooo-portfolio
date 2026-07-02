import { ImageResponse } from "next/og";
import { findBlogBySlug, visibleBlogsFilter } from "@/lib/data/blogs";
import { SITE_NAME } from "@/lib/constants/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await findBlogBySlug(slug, visibleBlogsFilter());

  if (!blog) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 56,
            color: "#fafafa",
            textAlign: "center",
          }}
        >
          Not Found
        </div>
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
      </div>,
      { ...size },
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(26,26,26,0.9) 0%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

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
          <div
            style={{
              display: "flex",
              fontFamily: "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: "#525252",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {blog.type}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: "#525252",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {formattedDate}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 48,
              height: 1,
              backgroundColor: "#fafafa",
              opacity: 0.3,
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: titleFontSize,
              fontWeight: 400,
              color: "#fafafa",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              maxWidth: "100%",
              wordWrap: "break-word",
            }}
          >
            {blog.title}
          </div>
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
          <div
            style={{
              display: "flex",
              fontFamily: "'SF Mono', 'Roboto Mono', 'Courier New', monospace",
              fontSize: 11,
              fontWeight: 400,
              color: "#525252",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            dennisjooo.vercel.app
          </div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
