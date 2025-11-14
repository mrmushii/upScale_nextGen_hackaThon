interface Props {
  techStack: string[];
}

export default function TechStackIcons({ techStack }: Props) {
  if (!techStack?.length) return null;

  const items = techStack.slice(0, 4);
  const remainder = techStack.length - items.length;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 border border-primary-200"
        >
          {tech}
        </span>
      ))}
      {remainder > 0 && (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
          +{remainder}
        </span>
      )}
    </div>
  );
}
