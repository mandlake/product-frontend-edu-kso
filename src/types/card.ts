export interface CardProps {
  id: number;
  notice?: boolean;
  hover?: boolean;
  pinned?: boolean;
  className?: string;
  star?: string;
  title?: string;
  content?: string;
  username?: string;
  date?: string;
  onClick?: (id: number) => void;
}
