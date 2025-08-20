export default function VerticalVideoPlayerWithSrc({ src, title }) {
  return (
    <div className="relative w-full h-full">
      <video
        src={src}
        title={title}
        controls
        muted
        playsInline
        loop={true}
        style={{ width: '100%', height: 'auto', aspectRatio: '9 / 16' }}
      />
    </div>
  );
}
