const segmentLabels: Record<string, string> = {
  infantil: "Infantil",
  fundamental: "Fundamental",
  medio: "Medio",
  eja: "EJA",
};

const materialTypeLabels: Record<string, string> = {
  ebook: "Ebook",
  video: "Video",
  quiz: "Quiz",
  pdf: "PDF",
  game: "Jogo",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  teacher: "Professor",
  student: "Estudante",
};

export function formatSegment(segment: string): string {
  return segmentLabels[segment] ?? segment;
}

export function formatMaterialType(type: string): string {
  return materialTypeLabels[type] ?? type;
}

export function formatRole(role: string): string {
  return roleLabels[role] ?? role;
}
