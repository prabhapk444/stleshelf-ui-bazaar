
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">{children}</div>
  );
};

export default Container;
