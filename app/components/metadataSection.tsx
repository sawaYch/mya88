import { Image } from "@nextui-org/react";

interface MetadataSectionProps {
  title?: string;
  thumbnail?: string;
}

export const MetadataSection = ({ title, thumbnail }: MetadataSectionProps) => {
  return (
    <div className="flex justify-center items-center text-xs gap-2 mb-1 select-none">
      <div className="max-w-[12rem] sm:max-w-full">{title ?? "lofi hip hop radio 📚 - beats to relax/study to"}</div>
      <div>
        <Image
          src={
            thumbnail ?? "https://i.ytimg.com/vi/jfKfPfyJRdk/default_live.jpg"
          }
          alt="thumbnail"
          width={64}
          height={24}
        />
      </div>
    </div>
  );
};
