"use client";
export default function TechIcon({ value, name }) {
  if (!value)
    return <span style={{ fontSize: "10px", opacity: 0.5 }}>{name}</span>;

  const isUrl = value.startsWith("http");

  return (
    <div
      className="tech-icon-container"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isUrl ? (
        <img
          src={value}
          alt={name || "icon"}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  );
}
