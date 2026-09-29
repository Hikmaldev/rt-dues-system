import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #14b8a6 0%, #0f766e 50%, #042f2e 100%)",
          position: "relative",
        }}
      >
        {/* SVG Graphic */}
        <svg
          width="130"
          height="130"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* House Roof */}
          <path
            d="M 116 236 L 256 120 L 396 236"
            stroke="#ffffff"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chimney */}
          <path
            d="M 342 168 L 342 136 C 342 131, 346 127, 351 127 L 361 127 C 366 127, 370 131, 370 136 L 370 192"
            stroke="#ffffff"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gold Coin */}
          <circle cx="256" cy="336" r="100" fill="#fbbf24" stroke="#fef08a" strokeWidth="6" />
          {/* Inner ring */}
          <circle cx="256" cy="336" r="86" stroke="#b45309" strokeWidth="4" strokeDasharray="10 8" />
          {/* Checkmark */}
          <path
            d="M 216 336 L 244 364 L 302 304"
            stroke="#ffffff"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
