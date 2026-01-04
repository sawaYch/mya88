import { Image } from "@heroui/react";

interface MetadataSectionProps {
  title?: string;
  thumbnail?: string;
}

export const MetadataSection = ({ title, thumbnail }: MetadataSectionProps) => {
  return (
    <div className="flex justify-center items-center text-xs gap-2 mb-1 select-none w-[70vw]">
      <div className="max-w-[12rem] sm:max-w-full line-clamp-2">
        {title ??
          "The Good Life Radio • 24/7 Live Radio | Best Relax House, Chillout, Study, Running, Gym, Happy Music"}
      </div>
      <div>
        <Image
          src={
            thumbnail ?? "https://i.ytimg.com/vi/36YnV9STBqc/default_live.jpg"
          }
          alt="thumbnail"
          width={64}
          height={36}
          className="aspect-video object-cover"
        />
      </div>
    </div>
  );
};
