export default function VideoPlayer({ src, title, isShowreel }) {
  return (
    <div className="relative w-full h-full">
      <video
        src={src}
        title={title}
        controls
        muted
        playsInline
        loop={isShowreel}
        style={{ width: '100%', height: 'auto' }}
      />
    </div> 
  );
}
