import Image from 'next/image';

interface CardProps {
  image: string;
  title: string;
}

export default function Card({ image, title }: CardProps) {
  return (
    <div className="rounded-xl shadow-md bg-white">
      <div className="p-3 pb-2">
        <h3 className="font-semibold text-lg text-center min-h-12 flex items-center justify-center text-[#1a7a7a]">{title}</h3>
      </div>
      <div className="px-3 pb-3">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full object-cover rounded-lg aspect-video"
        />
      </div>
    </div>
  );
}
