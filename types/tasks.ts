export interface Task {
  id: string;
  question: string;
  solution: string;
  room: string;
  tip: string;
  key: string;
  media?: { type: "image" | "video"; url: string }[];
}

export interface SearchItem {
  item: string;
  location: string;
}